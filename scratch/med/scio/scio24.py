# -*- coding: utf-8 -*-
"""Kurz 24 (On-line kurz VSP na VS) - vseobecne texty.

Rezimy:
    images   stiahne obrazky v povodnej velkosti cez prihlaseny debug Chrome (CDP 9994)
    parse    rozparsuje raw/wb/24_*.html do scio_vseob.json

Okrem typov, ktore pozna scio.py (choice, matching, sorting, open) parsuje aj
filling (radio tabulka / rozbalovacie zoznamy), selecting (oznac odstavec / vetu /
slovo / obrazok / bunku tabulky) a spolocne zadania (text-item), ktore pred
otazkami stoja ako samostatne bloky.
"""
import io, os, re, sys, json, glob
from bs4 import BeautifulSoup
import scio
from scio import (rich, rich_html, imgs, parse_multiple_choice, parse_matching,
                  parse_sorting, parse_open, ASSIGN, RAW, IMG_DIR, IB, HERE)

EID = "24"


# ---------------------------------------------------------------- images

def fetch_images():
    from playwright.sync_api import sync_playwright
    srcs = {}
    for f in sorted(glob.glob(os.path.join(RAW, "wb", EID + "_*.html"))):
        html = io.open(f, encoding="utf-8").read()
        for s in re.findall(r'src="(/Item/Image/[^"]+)"', html):
            srcs[s] = re.search(r"/Item/Image/([^?]+)", s).group(1)
    if not os.path.isdir(IMG_DIR):
        os.makedirs(IMG_DIR)
    amap_f = os.path.join(RAW, "images.json")
    amap = json.load(io.open(amap_f, encoding="utf-8")) if os.path.exists(amap_f) else {}
    done = {}
    with sync_playwright() as p:
        ctx = p.chromium.connect_over_cdp("http://127.0.0.1:9994").contexts[0]
        for cis in sorted(set(srcs.values())):
            # bez parametra height vracia server povodnu velkost (height=N skaluje)
            r = ctx.request.get(IB + "/Item/Image/" + cis, timeout=60000)
            b = r.body()
            if r.status != 200 or not b:
                print("  ! %s -> HTTP %d" % (cis, r.status))
                continue
            ext = ".png" if b[:4] == b"\x89PNG" else ".jpg" if b[:2] == b"\xff\xd8" \
                else ".gif" if b[:3] == b"GIF" else ".png"
            open(os.path.join(IMG_DIR, cis + ext), "wb").write(b)
            done[cis] = "/medimg/scio/" + cis + ext
    for s, cis in srcs.items():
        if cis in done:
            amap[s] = done[cis]
    io.open(amap_f, "w", encoding="utf-8").write(json.dumps(amap, ensure_ascii=False, indent=1))
    print("obrazky: %d / %d" % (len(done), len(set(srcs.values()))))


# ---------------------------------------------------------------- parsing

def dcolor(body):
    """{#i#}*cls;... -> {i: cls}"""
    el = body.find("input", id="DistractorsColor")
    out = {}
    for m in re.finditer(r"\{#(\d+)#\}\*([\w-]+)", el.get("value", "") if el else ""):
        out[int(m.group(1))] = m.group(2)
    return out


def good(cls):
    """Spravne = pouzivatelova spravna alebo spravne riesenie, ktore netrafil."""
    return "correct" in cls and "incorrect" not in cls


def sel_input(body):
    el = body.find("input", id=re.compile(r"_input$"))
    return {int(i): t for i, t in re.findall(r"\{#(\d+)#\}(.*?)(?=\{#\d+#\}|$)",
                                              el.get("value", "") if el else "", re.S)}


def sentences(text):
    parts = re.split(r"(?<=[.?!])\s+", text.strip())
    return [x for x in parts if x]


def parse_selecting(item, body):
    block, kind = body.get("selectableblock"), body.get("selectingtype")
    instr = body.find("div", class_=re.compile(r"item-isntruction"))
    a = body.find("div", class_=ASSIGN)
    units = []                                   # {"t","html","img"}
    if kind == "image":
        for im in a.find_all("img"):
            src = im.get("src", "")
            units.append({"t": im.get("alt", ""), "img": scio.IMGMAP.get(src)})
    elif kind == "table":
        for td in a.find_all("td"):
            units.append({"t": rich(td), "html": rich_html(td)})
    elif block == "paragraph":
        for p in a.find_all("p"):
            if p.get_text(strip=True) or p.find("img"):
                units.append({"t": rich(p), "html": rich_html(p)})
    elif block == "sentence":
        for p in a.find_all("p"):
            for s in sentences(p.get_text(" ", strip=False)):
                units.append({"t": re.sub(r"\s+", " ", s).strip()})
    else:                                        # word
        for p in a.find_all("p"):
            for w in re.split(r"[\s\xa0]+", p.get_text()):
                if w:
                    units.append({"t": w})
    colors = dcolor(body)
    ans = sorted(i for i, c in colors.items() if good(c))
    # kontrola: to, co pouzivatel oznacil (zaznamenane Sciom), musi sediet na jednotky
    for i, t in sel_input(body).items():
        if i >= len(units):
            raise ValueError("selecting: index %d mimo %d jednotiek" % (i, len(units)))
        want = re.sub(r"\s+", " ", t).strip()
        have = units[i]["t"]
        if kind == "image":
            ok = want == have
        else:
            ok = want == re.sub(r"\s+", " ", have).strip() or want in have or have in want
        if not ok:
            raise ValueError("selecting: jednotka %d '%s' != '%s'" % (i, have[:40], want[:40]))
    for i in ans:
        if i >= len(units):
            raise ValueError("selecting: spravny index %d mimo %d jednotiek" % (i, len(units)))
    d = {"type": "selecting", "unit": kind if kind in ("image", "table") else block,
         "q": rich(instr), "qHtml": rich_html(instr),
         "assignHtml": rich_html(a), "units": units, "ans": ans}
    figs = imgs(instr) + [f for f in imgs(a) if f not in imgs(instr)]
    if figs:
        d["figures"] = figs
    return d


def parse_filling(item, body):
    """Zadanie s markermi [[0]], [[1]]... na mieste ovladacich prvkov.
    fields[k] = {"options": [...], "ans": index spravnej moznosti}."""
    a = body.find("div", class_=ASSIGN)
    import copy
    a = copy.copy(a)
    fields = []

    def add(opts, classes):
        ans = [i for i, c in enumerate(classes) if good(c)]
        fields.append({"options": opts, "ans": ans[0] if len(ans) == 1 else ans})
        return "[[%d]]" % (len(fields) - 1)

    for sel in a.find_all("select"):
        opts, cls = [], []
        for o in sel.find_all("option"):
            t = o.get_text(strip=True)
            if re.fullmatch(r"_+", t):
                continue
            opts.append(t)
            cls.append(" ".join(o.get("class", [])))
        sel.replace_with(add(opts, cls))
    for grp in a.find_all(class_="filling-item-radio-buttons"):
        opts, cls = [], []
        for sp in grp.find_all(class_="filling-item-select", recursive=False):
            opts.append(sp.get_text(strip=True))
            cls.append(" ".join(sp.get("class", [])))
        grp.replace_with(add(opts, cls))
    if a.find(["input", "select"]):
        raise ValueError("filling: neznamy ovladaci prvok")
    d = {"type": "filling", "q": rich(a), "qHtml": rich_html(a), "fields": fields}
    for f in fields:
        if isinstance(f["ans"], list):
            raise ValueError("filling: nejednoznacna odpoved")
    figs = imgs(a)
    if figs:
        d["figures"] = figs
    return d


def parse_workbook(html):
    soup = BeautifulSoup(html, "lxml")
    root = soup.find(id="testRightContent")
    if root is None:
        return None
    questions, pre = [], []       # pre = bloky (teoria/spolocne zadanie) pred otazkou
    theory_text, theory_html, theory_imgs, n_blocks = [], [], [], 0
    for item in root.find_all("div", class_="item", recursive=False):
        cls = item.get("class", [])
        body = item.find(class_=re.compile(r"answerable-item"))
        if body is None:
            h = rich_html(item.find(class_="text-item") or item)
            title = ""
            num = item.find("div", class_="itemNumber")
            if num is not None:
                for hid in num.find_all("span", class_="hiddenInformation"):
                    hid.decompose()
                title = re.sub(r"\s+", " ", num.get_text(" ", strip=True))
            if "instruction-box" in cls:
                theory_imgs.extend(imgs(item))
                t = item.get_text("\n", strip=True)
                if t:
                    theory_text.append(t)
                if h:
                    theory_html.append(h)
                pre.append({"kind": "implicit" if "implicitInstruction" in cls else "theory",
                            "html": h})
            else:
                pre.append({"kind": "passage", "title": title, "html": h})
            n_blocks += 1
            continue
        bcls = " ".join(body.get("class", []))
        if "matching-item" in bcls:
            qd = parse_matching(item)
        elif "multiple-choice-item" in bcls:
            qd = parse_multiple_choice(item)
        elif "sorting-item" in bcls:
            qd = parse_sorting(item)
            # polozky, ktore su len obrazok, nemaju text, no poradie je znamy
            if not qd["reliable"] and all(i["pos"] is not None for i in qd["items"]) \
                    and all(i["t"] or "<img" in i["html"] for i in qd["items"]):
                qd["reliable"] = True
        elif "open-item" in bcls:
            qd = parse_open(item)
        elif "selecting-item" in bcls:
            qd = parse_selecting(item, body)
        elif "filling-item" in bcls:
            qd = parse_filling(item, body)
        else:
            raise ValueError("neznamy typ otazky: " + bcls)
        num = item.find("div", class_="itemNumber")
        m = re.search(r"(\d+)", num.get_text() if num else "")
        qd["n"] = int(m.group(1)) if m else len(questions) + 1
        steps = item.select(".step.rich-content")
        exp = " ".join(x for x in (rich(s) for s in steps) if x)
        if exp:
            qd["explanation"] = exp
        exp_html = "".join(x for x in (rich_html(s) for s in steps) if x)
        if exp_html:
            qd["explanationHtml"] = exp_html
        if pre:
            qd["pre"] = pre
            pre = []
        questions.append(qd)
    if pre:   # bloky za poslednou otazkou
        questions.append({"type": "trailing", "pre": pre})
    t = soup.find("title")
    return {"title": t.get_text(strip=True) if t else "",
            "theory": "\n\n".join(theory_text), "theoryHtml": "".join(theory_html),
            "theory_figures": theory_imgs, "questions": questions, "blocks": n_blocks}


def parse():
    scio.load_imgmap()
    index = json.load(io.open(os.path.join(RAW, "index.json"), encoding="utf-8"))[EID]
    out_l, stats = [], {}
    n_items = 0
    for l in index["lessons"]:
        p = os.path.join(RAW, "wb", "%s_%s.html" % (EID, l["wb"]))
        if not os.path.exists(p):
            print("  - nestiahnute (nevyriesena):", l["name"])
            continue
        html = io.open(p, encoding="utf-8").read()
        wb = parse_workbook(html)
        qs = [q for q in wb["questions"] if q["type"] != "trailing"]
        for q in qs:
            stats[q["type"]] = stats.get(q["type"], 0) + 1
        # kontrola uplnosti: kazdy .item v DOM je otazka alebo blok
        root = BeautifulSoup(html, "lxml").find(id="testRightContent")
        n_dom = len(root.find_all("div", class_="item", recursive=False))
        n_items += n_dom
        assert n_dom == len(qs) + wb["blocks"], (l["name"], n_dom, len(qs), wb["blocks"])
        out_l.append({"wb": l["wb"], "name": l["name"], "section": l["section"],
                      "theory": wb["theory"], "theoryHtml": wb["theoryHtml"],
                      "theory_figures": wb["theory_figures"],
                      "questions": wb["questions"]})
    out = os.path.join(HERE, "scio_vseob.json")
    io.open(out, "w", encoding="utf-8").write(json.dumps(
        {"eid": EID, "title": index["title"], "lessons": out_l},
        ensure_ascii=False, indent=1))
    print("%d lekcii, %d poloziek v DOM, otazky: %s" % (len(out_l), n_items, stats))


if __name__ == "__main__":
    {"images": fetch_images, "parse": parse}[sys.argv[1]]()
