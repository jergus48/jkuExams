# -*- coding: utf-8 -*-
"""For chemistry questions whose options are drawn structures, crop the whole
a)..h) block as one figure (per page, if the block spans a page break)."""
import fitz, os, re
from crop import doc, find_question, option_marks

OUT = "public/medimg"

def crop_block(n, outdir=OUT, zoom=2.2):
    loc = find_question(n)
    if not loc:
        return None
    pno, qy, _ = loc
    marks = option_marks(pno, qy)
    if len(marks) != 8:
        return None
    by_page = {}
    for i, m in enumerate(marks):
        by_page.setdefault(m[0], []).append(m)
    urls = []
    for p in sorted(by_page):
        page = doc[p]
        group = by_page[p]
        labelx = min(m[1] for m in group)
        first_ly = min(m[2] for m in group)
        # top: just below the stem on the question's own page
        if p == pno:
            top = qy + 6
            for b in page.get_text("dict")["blocks"]:
                for l in b.get("lines", []):
                    lx0, ly0, lx1, ly1 = l["bbox"]
                    if ly0 < first_ly - 1 and lx0 <= labelx + 3:
                        top = max(top, ly1)
            top += 1
        else:
            top = 30
        # bottom: last ink above the next question / page footer
        if p == max(by_page):
            last_ly = max(m[2] for m in group)
            # never run into the next question printed below the block
            limit = page.rect.height - 45
            for w in page.get_text("words"):
                if w[0] < 120 and w[1] > last_ly + 2 and re.match(r'^\d{1,4}\.$', w[4]):
                    limit = min(limit, w[1] - 4)
            bottom = last_ly + 14
            for b in page.get_text("dict")["blocks"]:
                for l in b.get("lines", []):
                    lx0, ly0, lx1, ly1 = l["bbox"]
                    if ly0 >= last_ly - 2 and ly1 < limit:
                        bottom = max(bottom, ly1)
            for dr in page.get_drawings():
                r = dr["rect"]
                if r.y0 >= last_ly - 12 and r.y1 < limit and r.width < page.rect.width:
                    bottom = max(bottom, r.y1)
        else:
            limit = page.rect.height - 20
            bottom = page.rect.height - 50
        bottom = min(bottom + 3, limit)
        rect = fitz.Rect(labelx - 3, max(top, 0), page.rect.width - 40, bottom)
        if rect.height < 10:
            return None
        pix = page.get_pixmap(clip=rect, matrix=fitz.Matrix(zoom, zoom), colorspace=fitz.csGRAY)
        if not os.path.isdir(outdir):
            os.makedirs(outdir)
        name = "ch_%d_%d.png" % (n, len(urls) + 1)
        pix.save(os.path.join(outdir, name))
        urls.append("medimg/" + name)
    return urls
