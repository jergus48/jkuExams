import io, re, sys, time
from playwright.sync_api import sync_playwright
sys.path.insert(0, ".")
from scio import parse_course_index
APP = "https://onlinepriprava.scio.cz"
h = io.open("raw24/course_24.html", encoding="utf-8").read()
todo = [l for l in parse_course_index(h, "24") if not l["done"] and l["wb"] != "342"]
with sync_playwright() as p:
    ctx = p.chromium.connect_over_cdp("http://127.0.0.1:9994").contexts[0]
    for l in todo:
        pg = ctx.new_page()
        pg.goto(APP + "/OnlinePripravaVS/Elearning/StartWorkbook?workbookId=%s&ElearningId=24" % l["wb"], wait_until="domcontentloaded")
        pg.wait_for_timeout(2500)
        for _ in range(2):
            c = pg.query_selector("#continueLink")
            if c: c.click(); pg.wait_for_timeout(2500)
        n = 0
        while n < 400:
            nx = pg.query_selector("#buttonNextPage")
            if not nx or not nx.is_visible(): break
            nx.click(); pg.wait_for_timeout(450); n += 1
        print(l["wb"], "steps", n, pg.url[:60], flush=True)
        pg.close()
