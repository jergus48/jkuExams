import io, os, re, sys, json, time
sys.path.insert(0, ".")
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright
from scio import parse_course_index, APP
eid = "24"
html = io.open("raw24/course_24.html", encoding="utf-8").read()
lessons = parse_course_index(html, eid)
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://127.0.0.1:9994")
    ctx = b.contexts[0]
    for i, l in enumerate(lessons, 1):
        dest = "raw/wb/%s_%s.html" % (eid, l["wb"])
        if not l["done"]:
            print(i, l["wb"], "unsolved, skip"); continue
        if os.path.exists(dest):
            print(i, l["wb"], "have"); continue
        u = APP + "/OnlinePripravaVS/Elearning/FilledWorkbook?workbookId=%s&ElearningId=%s" % (l["wb"], eid)
        r = ctx.request.get(u, timeout=60000)
        txt = r.text()
        for _ in range(3):
            if "testRightContent" in txt: break
            m = re.search(r'id="continueLink"[^>]*href="([^"]+)"', txt)
            if not m: break
            r = ctx.request.get(urljoin(r.url, m.group(1)), timeout=60000)
            txt = r.text()
        ok = "testRightContent" in txt
        io.open(dest, "w", encoding="utf-8").write(txt)
        print(i, l["wb"], len(txt), "ok" if ok else "NO QUESTIONS", r.status)
        time.sleep(0.5)
json.dump({eid: {"title": "On-line kurz VSP na VS", "lessons": lessons}}, open("raw24/index24.json", "w"), ensure_ascii=False, indent=1)
