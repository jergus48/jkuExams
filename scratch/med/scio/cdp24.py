import io, sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://127.0.0.1:9994")
    pg = [pg for c in b.contexts for pg in c.pages if "scio.cz" in pg.url][0]
    print(pg.url, pg.title())
    pg.goto("https://onlinepriprava.scio.cz/OnlinePripravaVS/DetailKurzu/24", wait_until="domcontentloaded"); pg.wait_for_timeout(2500)
    html = pg.content()
    io.open("raw24/course_24.html", "w", encoding="utf-8").write(html)
    print(len(html))
