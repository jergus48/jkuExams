# -*- coding: utf-8 -*-
"""Scraper kurzov Scio online priprava VS (onlinepriprava.scio.cz).

Rezimy:
    fetch [id...]   prihlasi sa, stiahne kurz(y) a vsetky vyriesene lekcie do raw/
    parse           rozparsuje raw/ do scio_bio.json / scio_chem.json
    all             fetch + parse

Prihlasovacie udaje z env: SCIO_LOGIN, SCIO_PASSWORD
"""
import io, os, re, sys, json, time, glob, copy
import requests
from bs4 import BeautifulSoup

SHOP = "https://eshop.scio.sk"
APP = "https://onlinepriprava.scio.cz"
HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
COURSES = {"64": "bio", "68": "chem"}

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")


# ---------------------------------------------------------------- fetch

def _rawdir(sub=""):
    p = os.path.join(RAW, sub) if sub else RAW
    if not os.path.isdir(p):
        os.makedirs(p)
    return p


def login():
    user, pwd = os.environ.get("SCIO_LOGIN"), os.environ.get("SCIO_PASSWORD")
    if not user or not pwd:
        raise SystemExit("nastav SCIO_LOGIN a SCIO_PASSWORD")
    s = requests.Session()
    s.headers.update({"User-Agent": UA, "Accept-Language": "sk,cs;q=0.9"})
    url = SHOP + "/Profile/Login/LoginPassword?login=" + requests.utils.quote(user)
    r = s.get(url, timeout=30)
    r.raise_for_status()
    m = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', r.text)
    if not m:
        raise SystemExit("chyba __RequestVerificationToken")
    r = s.post(SHOP + "/Profile/Login/LoginPassword",
               data={"Login": user, "Password": pwd,
                     "__RequestVerificationToken": m.group(1)},
               headers={"Referer": url}, timeout=30)
    r.raise_for_status()

    # eshop login sam o sebe nestaci - na onlinepriprava.scio.cz sa ide cez
    # SSO handoff: POST /Profile/Online/Enter (idUser + target + antiforgery)
    r = s.get(SHOP + "/Profile/Online", timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "lxml")
    form = None
    for f in soup.find_all("form"):
        if "/Profile/Online/Enter" in (f.get("action") or ""):
            form = f
            break
    if form is None:
        io.open(os.path.join(_rawdir(), "login_failed.html"), "w",
                encoding="utf-8").write(r.text)
        raise SystemExit("nenasiel som SSO formular /Profile/Online/Enter "
                         "-> raw/login_failed.html (zle heslo?)")
    data = {i.get("name"): i.get("value", "")
            for i in form.find_all("input") if i.get("name")}
    r = s.post(SHOP + "/Profile/Online/Enter", data=data,
               headers={"Referer": SHOP + "/Profile/Online"}, timeout=30)
    r.raise_for_status()

    r = s.get(APP + "/OnlinePripravaVS", timeout=30)
    if "LogOn" in r.text or "- Login</title>" in r.text:
        io.open(os.path.join(_rawdir(), "login_failed.html"), "w",
                encoding="utf-8").write(r.text)
        raise SystemExit("SSO na onlinepriprava zlyhalo -> raw/login_failed.html")
    print("prihlaseny (SSO ok)")
    return s


def parse_course_index(html, eid):
    """Vrati [{wb, name, section, done}] v poradi kurzu."""
    soup = BeautifulSoup(html, "lxml")
    out, seen = [], set()
    for li in soup.select("li"):
        lab = li.find("label", class_=re.compile(r"section-summary-label"))
        det = li.find("div", class_="section-detail")
        if not lab or not det:
            continue
        section = lab.get_text(" ", strip=True)
        for a in det.select("a.workbook-name"):
            href = a.get("href", "")
            m = re.search(r"[?&]workbookId=(\d+)", href, re.I)
            if not m or m.group(1) in seen:
                continue
            seen.add(m.group(1))
            out.append({"wb": m.group(1), "name": a.get_text(" ", strip=True),
                        "section": section, "eid": eid,
                        "done": "FilledWorkbook" in href})
    return out


def get_workbook(s, url, tries=3):
    """FilledWorkbook -> redirect na ib.scio.cz, kde ale najprv sedi medzistranka
    'Kontrola kompatibility prehliadaca' s odkazom na skutocny /Test?t=<token>."""
    last = None
    for attempt in range(tries):
        try:
            r = s.get(url, timeout=60)
            for _ in range(3):
                if "testRightContent" in r.text:
                    return r
                m = re.search(r'id="continueLink"[^>]*href="([^"]+)"', r.text)
                if not m:
                    break
                r = s.get(requests.compat.urljoin(r.url, m.group(1)), timeout=60)
            return r
        except requests.RequestException as e:
            last = e
            time.sleep(2 + 2 * attempt)
    raise last


IMG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(HERE))),
                       "public", "medimg", "scio")
IB = "https://ib.scio.cz"


def fetch_images(s=None):
    """Stiahne vsetky /Item/Image/CIS-xxxxx z ulozenych workbookov do
    public/medimg/scio/ a zapise mapu src -> lokalny subor."""
    if s is None:
        s = login()
    if not os.path.isdir(IMG_DIR):
        os.makedirs(IMG_DIR)
    srcs = set()
    for f in sorted(glob.glob(os.path.join(RAW, "wb", "*.html"))):
        html = io.open(f, encoding="utf-8").read()
        srcs.update(re.findall(r'src="(/Item/Image/[^"]+)"', html))
    print("unikatnych obrazkov:", len(srcs))
    amap = {}
    for i, src in enumerate(sorted(srcs), 1):
        cis = re.search(r"/Item/Image/([^?]+)", src).group(1)
        dest = os.path.join(IMG_DIR, cis + ".png")
        amap[src] = "/medimg/scio/" + cis + ".png"
        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            continue
        r = s.get(IB + src, timeout=60)
        if r.status_code != 200 or not r.content:
            print("  ! %s -> HTTP %d" % (src, r.status_code))
            continue
        open(dest, "wb").write(r.content)
        if i % 25 == 0:
            print("  [%d/%d]" % (i, len(srcs)))
        time.sleep(0.2)
    io.open(os.path.join(RAW, "images.json"), "w", encoding="utf-8").write(
        json.dumps(amap, ensure_ascii=False, indent=1))
    print("obrazky ulozene do", IMG_DIR)


def load_index():
    f = os.path.join(RAW, "index.json")
    return json.load(io.open(f, encoding="utf-8")) if os.path.exists(f) else {}


def reindex():
    """Obnovi index.json z uz stiahnutych course_*.html (bez prihlasovania)."""
    index = load_index()
    for f in sorted(glob.glob(os.path.join(RAW, "course_*.html"))):
        eid = re.search(r"course_(\d+)\.html", f).group(1)
        html = io.open(f, encoding="utf-8").read()
        h1 = BeautifulSoup(html, "lxml").find("h1")
        index[eid] = {"title": h1.get_text(strip=True) if h1 else eid,
                      "lessons": parse_course_index(html, eid)}
        print("kurz %s: %d lekcii" % (eid, len(index[eid]["lessons"])))
    io.open(os.path.join(_rawdir(), "index.json"), "w", encoding="utf-8").write(
        json.dumps(index, ensure_ascii=False, indent=1))
    print("index obnoveny")


def fetch(ids):
    s = login()
    index = load_index()   # doplna sa, aby fetch jedneho kurzu nezmazal ostatne
    for eid in ids:
        r = s.get(APP + "/OnlinePripravaVS/DetailKurzu/" + eid, timeout=60)
        r.raise_for_status()
        io.open(os.path.join(_rawdir(), "course_%s.html" % eid), "w",
                encoding="utf-8").write(r.text)
        lessons = parse_course_index(r.text, eid)
        h1 = BeautifulSoup(r.text, "lxml").find("h1")
        title = h1.get_text(strip=True) if h1 else eid
        print("\nkurz %s: %s - %d lekcii (%d vyriesenych)"
              % (eid, title, len(lessons), sum(1 for l in lessons if l["done"])))
        index[eid] = {"title": title, "lessons": lessons}

        for i, l in enumerate(lessons, 1):
            dest = os.path.join(_rawdir("wb"), "%s_%s.html" % (eid, l["wb"]))
            if os.path.exists(dest):
                print("  [%2d/%d] %s - uz stiahnute" % (i, len(lessons), l["name"]))
                continue
            if not l["done"]:
                print("  [%2d/%d] %s - NEVYRIESENA, preskakujem"
                      % (i, len(lessons), l["name"]))
                continue
            u = (APP + "/OnlinePripravaVS/Elearning/FilledWorkbook"
                 "?workbookId=%s&ElearningId=%s" % (l["wb"], eid))
            try:
                rr = get_workbook(s, u)
            except Exception as e:
                print("  [%2d/%d] %s -> CHYBA: %s" % (i, len(lessons), l["name"], e))
                continue
            ok = "testRightContent" in rr.text
            io.open(dest, "w", encoding="utf-8").write(rr.text)
            print("  [%2d/%d] %s -> %d znakov %s"
                  % (i, len(lessons), l["name"], len(rr.text),
                     "" if ok else "(!! bez otazok)"))
            time.sleep(0.7)

    io.open(os.path.join(_rawdir(), "index.json"), "w", encoding="utf-8").write(
        json.dumps(index, ensure_ascii=False, indent=1))
    print("\nindex ulozeny")


# ---------------------------------------------------------------- parse

def rich(el):
    """Text z .rich-content, spojeny do jedneho riadku."""
    if el is None:
        return ""
    for bad in el.select("script,style"):
        bad.decompose()
    parts = [p.get_text(" ", strip=True) for p in el.find_all("p")]
    txt = " ".join(x for x in parts if x) if parts else el.get_text(" ", strip=True)
    return re.sub(r"\s+", " ", txt).strip()


# Znacky, ktore sa v obsahu Scia realne vyskytuju a nesu formatovanie.
# Bez <sup>/<sub> by sa p^2 rozpadlo na "p" a "2" na dalsom riadku.
HTML_OK = {"p", "br", "b", "strong", "i", "em", "u", "sup", "sub", "span",
           "div", "ul", "ol", "li", "table", "thead", "tbody", "tr", "td",
           "th", "img"}
HTML_DROP = {"script", "style", "iframe", "input", "button", "form",
             "object", "embed", "link", "meta"}


def rich_html(el):
    """Ocisteny HTML obsah elementu - zachova formatovanie (indexy, tabulky,
    zoznamy) a obrazkom prepise src na lokalnu cestu."""
    if el is None:
        return ""
    el = copy.copy(el)
    for bad in el.find_all(list(HTML_DROP)):
        bad.decompose()
    for t in el.find_all(True):
        if t.name not in HTML_OK:
            t.unwrap()
            continue
        if t.name == "img":
            src = t.get("src", "")
            local = IMGMAP.get(src)
            if local is None:
                m = re.search(r"/Item/Image/([^?]+)", src)
                local = "/medimg/scio/" + m.group(1) + ".png" if m else None
            if not local:
                t.decompose()
                continue
            t.attrs = {"src": local, "alt": t.get("alt", "")}
        else:
            keep = {}
            if t.name in ("td", "th"):
                for a in ("colspan", "rowspan"):
                    if t.get(a):
                        keep[a] = t[a]
            t.attrs = keep
    out = el.decode_contents() if hasattr(el, "decode_contents") else str(el)
    out = re.sub(r"[ \t]*\n[ \t]*", "\n", out)
    return re.sub(r"\n{3,}", "\n\n", out).strip()


ASSIGN = re.compile(r'\bassignment\b')

IMGMAP = {}


def load_imgmap():
    global IMGMAP
    f = os.path.join(RAW, "images.json")
    IMGMAP = json.load(io.open(f, encoding="utf-8")) if os.path.exists(f) else {}


def imgs(el):
    """Zoznam lokalnych ciest k obrazkom v elemente."""
    if el is None:
        return []
    out = []
    for im in el.find_all("img"):
        src = im.get("src", "")
        if not src.startswith("/Item/Image/"):
            continue
        local = IMGMAP.get(src)
        if local is None:
            cis = re.search(r"/Item/Image/([^?]+)", src)
            local = "/medimg/scio/" + cis.group(1) + ".png" if cis else None
        if local and local not in out:
            out.append(local)
    return out


def opt_is_correct(classes):
    """Legenda: *-correct = moja spravna, *-incorrect = moja nespravna,
    *-missed = spravne riesenie ktore som netrafil."""
    c = " ".join(classes)
    if "incorrect" in c or "wrong" in c:
        return False
    return ("correct" in c) or ("missed" in c)


def pick_body(item, cls):
    """Item moze obsahovat dva bloky: odpoved pouzivatela (id CIS-xxx) a spravne
    riesenie (id CIS-xxxevaluated). Ked je pritomny evaluated, berie sa ten."""
    bodies = item.select("." + cls + ".answerable-item")
    for b in bodies:
        if (b.get("id") or "").endswith("evaluated"):
            return b
    return bodies[0] if bodies else item


def hidden_map(body):
    """Mapa id polozky -> cielovy slot. Berie sa _inputevaluated (spravne
    riesenie); _input je len to, co nakliskal pouzivatel, takze sluzi ako zaloha
    ked vyhodnotenie v HTML nie je."""
    for suffix in ("_inputevaluated", "_input"):
        hid = body.find("input", id=re.compile(re.escape(suffix) + r"$"))
        if hid is None:
            continue
        try:
            d = json.loads(hid.get("value") or "{}")
        except ValueError:
            continue
        if d:
            return d
    return {}


def parse_multiple_choice(item):
    a = item.find("div", class_=ASSIGN)
    q, q_html = rich(a), rich_html(a)
    opts, opts_html, ans = [], [], []
    for i, o in enumerate(item.select(".options .option-item")):
        lab = o.find("label")
        if lab:
            key = lab.find("span", class_="itemOptionKey")
            if key:
                key.decompose()
        opts.append(rich(lab))
        opts_html.append(rich_html(lab))
        if opt_is_correct(o.get("class", [])):
            ans.append(i)
    mx = item.find("input", class_="MaxAnswers")
    multi = not (mx is not None and mx.get("value") == "1")
    figs = imgs(a)
    for o in item.select(".options .option-item"):
        for f in imgs(o):
            if f not in figs:
                figs.append(f)
    d = {"type": "choice", "q": q, "qHtml": q_html, "opts": opts,
         "optsHtml": opts_html, "ans": ans, "multi": multi}
    if figs:
        d["figures"] = figs
    return d


def parse_matching(item):
    q = rich(item.find("div", class_=ASSIGN))
    # Skryty _input mapuje id presuvatelnej polozky -> nazov cieloveho slotu
    # ("ans3"). Slot "ansN" sedi v N-tom riadku tabulky, takze spravny par je
    # (fixny text riadku N, text polozky priradenej do ansN). Samotne polozky
    # su v DOM zaparkovane v stlpci "noansN" v povodnom poradi, nie v sparovanom.
    body = pick_body(item, "matching-item")
    slot_of = hidden_map(body)
    by_slot, choices = {}, []
    for drag in body.select(".matching-item-moveable"):
        val = {"text": rich(drag), "html": rich_html(drag),
               "img": (imgs(drag) or [None])[0]}
        choices.append(val)                       # poradie ako ich vidi student
        slot = slot_of.get(drag.get("id"))
        if slot:
            by_slot[slot] = val

    pairs = []
    for row in body.select("table.dragDropTable tbody tr"):
        fixed = row.find(class_=re.compile(r"matching-item-fixed"))
        if not fixed:
            continue
        slot = row.find("td", class_=re.compile(r"matching-item-answer"))
        name = slot.get("name") if slot is not None else None
        val = by_slot.get(name) or {"text": "", "html": "", "img": None}
        # Zadanie aj priradovana polozka moze byt obrazok namiesto textu.
        pairs.append({"l": rich(fixed), "lHtml": rich_html(fixed),
                      "limg": (imgs(fixed) or [None])[0],
                      "r": val["text"], "rHtml": val.get("html", ""),
                      "rimg": val["img"]})
    d = {"type": "matching", "q": q,
         "qHtml": rich_html(item.find("div", class_=ASSIGN)),
         "pairs": pairs, "choices": choices}
    figs = imgs(item.find("div", class_=ASSIGN))
    if figs:
        d["figures"] = figs
    return d


def parse_sorting(item):
    """Zoradovacia otazka. Skryte _inputevaluated mapuje id polozky na poziciu
    ("0", "1", ...) alebo na "binN" pri polozkach, ktore do zoradenia nepatria
    (Scio ma pre ne samostatny kos)."""
    q = rich(item.find("div", class_=ASSIGN))
    body = pick_body(item, "sorting-item")
    slot = hidden_map(body)
    items, ok = [], True
    for li in body.select("ul.sorting-item-sortlist > li, ul.sorting-item-binlist > li"):
        val = str(slot.get(li.get("id"), ""))
        text, thtml = rich(li), rich_html(li)
        if val.isdigit():
            items.append({"t": text, "html": thtml, "pos": int(val)})
        elif val.startswith("bin"):
            items.append({"t": text, "html": thtml, "pos": None})  # nepatri sem
        else:
            items.append({"t": text, "html": thtml, "pos": None})
            ok = False
        if not text:
            ok = False
    d = {"type": "sorting", "q": q,
         "qHtml": rich_html(item.find("div", class_=ASSIGN)),
         "items": items, "reliable": ok,
         "order": [i["t"] for i in sorted(
             (x for x in items if x["pos"] is not None), key=lambda x: x["pos"])]}
    figs = imgs(item.find("div", class_=ASSIGN))
    if figs:
        d["figures"] = figs
    return d


def parse_open(item):
    """Otvorena otazka: spravna odpoved je v title atribute .open-item-evaluated-input."""
    # "isntruction" nie je preklep tu, ale v markupe Scia.
    box = item.find("div", class_=re.compile(r"item-isntruction"))
    assign = item.find("div", class_=ASSIGN)
    q = rich(box) or rich(assign)
    q_html = rich_html(box) or rich_html(assign)
    answers = []
    for sp in item.select(".open-item-evaluated-input"):
        t = sp.get("title")
        if t is None:
            inp = sp.find("input")
            t = inp.get("value", "") if inp else ""
        answers.append((t or "").strip())
    d = {"type": "open", "q": q, "qHtml": q_html, "answers": answers}
    figs = imgs(box) or imgs(assign)
    if figs:
        d["figures"] = figs
    return d


def parse_workbook(html):
    soup = BeautifulSoup(html, "lxml")
    root = soup.find(id="testRightContent")
    if root is None:
        return None
    t = soup.find("title")
    title = t.get_text(strip=True) if t else ""
    questions, theory_parts, theory_html, theory_imgs = [], [], [], []
    for item in root.find_all("div", class_="item", recursive=False):
        if "instruction-box" in item.get("class", []):
            # Lekcia moze mat aj viac teoretickych blokov, vsetky sa spoja.
            theory_imgs.extend(imgs(item))
            part = item.get_text("\n", strip=True)
            if part:
                theory_parts.append(part)
            part_html = rich_html(item)
            if part_html:
                theory_html.append(part_html)
            continue
        body = item.find(class_=re.compile(r"answerable-item"))
        if body is None:
            continue
        bcls = " ".join(body.get("class", []))
        if "matching-item" in bcls:
            qd = parse_matching(item)
        elif "multiple-choice-item" in bcls:
            qd = parse_multiple_choice(item)
        elif "sorting-item" in bcls:
            qd = parse_sorting(item)
        elif "open-item" in bcls:
            qd = parse_open(item)
        else:
            continue
        num = item.find("div", class_="itemNumber")
        m = re.search(r"(\d+)", num.get_text() if num else "")
        qd["n"] = int(m.group(1)) if m else len(questions) + 1
        steps = [rich(s) for s in item.select(".step.rich-content")]
        exp = " ".join(x for x in steps if x)
        if exp:
            qd["explanation"] = exp
        steps_html = [rich_html(s) for s in item.select(".step.rich-content")]
        exp_html = "".join(x for x in steps_html if x)
        if exp_html:
            qd["explanationHtml"] = exp_html
        questions.append(qd)
    return {"title": title, "theory": "\n\n".join(theory_parts),
            "theoryHtml": "".join(theory_html),
            "theory_figures": theory_imgs,
            "questions": questions}


def parse_all():
    load_imgmap()
    index = json.load(io.open(os.path.join(RAW, "index.json"), encoding="utf-8"))
    for eid, info in index.items():
        slug = COURSES.get(eid, eid)
        lessons_out = []
        stats = {"choice": 0, "matching": 0, "sorting": 0, "open": 0, "skipped": 0}
        for l in info["lessons"]:
            p = os.path.join(RAW, "wb", "%s_%s.html" % (eid, l["wb"]))
            if not os.path.exists(p):
                stats["skipped"] += 1
                continue
            wb = parse_workbook(io.open(p, encoding="utf-8").read())
            if not wb or not wb["questions"]:
                stats["skipped"] += 1
                print("  ! bez otazok:", l["name"])
                continue
            for q in wb["questions"]:
                stats[q["type"]] += 1
            lessons_out.append({"wb": l["wb"], "name": l["name"],
                                "section": l["section"], "theory": wb["theory"],
                                "theoryHtml": wb["theoryHtml"],
                                "theory_figures": wb["theory_figures"],
                                "questions": wb["questions"]})
        out = os.path.join(HERE, "scio_%s.json" % slug)
        io.open(out, "w", encoding="utf-8").write(
            json.dumps({"eid": eid, "title": info["title"], "lessons": lessons_out},
                       ensure_ascii=False, indent=1))
        print("%s -> %s\n  %d lekcii | choice %d, matching %d, sorting %d, "
              "open %d | preskocenych %d"
              % (info["title"], out, len(lessons_out), stats["choice"],
                 stats["matching"], stats["sorting"], stats["open"],
                 stats["skipped"]))


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    ids = sys.argv[2:] or list(COURSES)
    if mode == "reindex":
        reindex()
    if mode in ("fetch", "all"):
        fetch(ids)
    if mode in ("images", "all"):
        fetch_images()
    if mode in ("parse", "all"):
        parse_all()
