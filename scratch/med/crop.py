# -*- coding: utf-8 -*-
"""Crop option regions for questions whose choices are drawn structures."""
import fitz, io, re, json, os, sys

PDF = "C:/Users/Jergus/Downloads/SK_CH_2024_pdf ISBN (1).pdf"
OUT = "public/medimg"
LETTERS = "abcdefgh"

doc = fitz.open(PDF)

def page_words(pno):
    return doc[pno].get_text("words")  # x0,y0,x1,y1,word,block,line,wordno

def find_question(n):
    """Return (pno, y) of the 'N.' label starting question n."""
    pat = "%d." % n
    for pno in range(doc.page_count):
        for w in page_words(pno):
            if w[4] == pat and w[0] < 120:
                return pno, w[1], w[0]
    return None

def option_marks(pno, ystart, nmax=3):
    """Collect option labels a)..h) starting at (pno, ystart), following pages."""
    marks = []
    want = 0
    for k in range(nmax):
        p = pno + k
        if p >= doc.page_count:
            break
        for w in sorted(page_words(p), key=lambda w: (round(w[1], 1), w[0])):
            if k == 0 and w[1] < ystart - 1:
                continue
            if want < 8 and w[4] == LETTERS[want] + ")" and w[0] < 150:
                marks.append((p, w[0], w[1], w[3]))
                want += 1
        if want >= 8:
            break
    return marks

def crop_options(n, outdir=OUT, zoom=2.5):
    loc = find_question(n)
    if not loc:
        return None
    pno, y, _ = loc
    marks = option_marks(pno, y)
    if len(marks) != 8:
        return None
    urls = {}
    for i, (p, x0, ytop, ybot) in enumerate(marks):
        page = doc[p]
        prev = marks[i-1] if i > 0 else None
        nxt = marks[i+1] if i + 1 < 8 else None
        # Options can be multi-line (fractions, structures) whose ink extends
        # above the label baseline, so cut at the midpoints between labels.
        if prev and prev[0] == p:
            top = (prev[2] + ytop) / 2.0
        else:
            top = max(ytop - 14, 30)
        if nxt and nxt[0] == p:
            bottom = (ytop + nxt[2]) / 2.0
        else:
            bottom = page.rect.height - 55
        bottom = min(bottom, page.rect.height - 20)
        rect = fitz.Rect(x0 + 12, max(top, 0), page.rect.width - 45, max(bottom, top + 14))
        if rect.height < 8 or rect.width < 20:
            return None
        pix = page.get_pixmap(clip=rect, matrix=fitz.Matrix(zoom, zoom), colorspace=fitz.csGRAY)
        name = "ch_%d_%s.png" % (n, LETTERS[i])
        if not os.path.isdir(outdir):
            os.makedirs(outdir)
        pix.save(os.path.join(outdir, name))
        urls[i] = "medimg/" + name
    return urls
