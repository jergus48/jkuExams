# -*- coding: utf-8 -*-
"""Parse the LF UK question books straight from the PDF text layer.

Each question is "N. stem" followed by options "a) ..." .. "h) ...".
The answer key at the end of the book lists, per question number, eight
S/N flags (S = správne / correct) for options a..h.
"""
import io, re, json, sys

def load(p):
    return io.open(p, encoding='utf-8').read()

def split_body_key(text):
    m = re.search(r'K[ľl]ú[čc] k ot[áa]zkam', text)
    if m:
        return text[:m.start()], text[m.start():]
    # biology: key pages hold bare "number\nSNSN..." pairs; find first such run
    m = re.search(r'(?m)^\s*(\d{1,4})\s*\n\s*([SN]{8})\s*$', text)
    return text[:m.start()], text[m.start():]

def parse_key(keytext):
    key = {}
    for m in re.finditer(r'(?m)^\s*(\d{1,4})\s*\.?\s*\n?\s*([SN]{8})\s*$', keytext):
        key[int(m.group(1))] = m.group(2)
    for m in re.finditer(r'(?m)^\s*(\d{1,4})\s*\.\s*([SN]{8})\s*$', keytext):
        key[int(m.group(1))] = m.group(2)
    return key

PAGE = re.compile(r'(?m)^\f?\[\[PAGE \d+\]\]\s*$')

def strip_noise(text):
    text = PAGE.sub('', text)
    text = re.sub(r'(?m)^\s*\d{1,3}\s*$', '', text)          # printed page numbers
    return text

QNUM = re.compile(r'(?m)^\s*(\d{1,4})\.\s')
# fallback for numbers that lost their dot in print (e.g. bio 529)
QNUM_LOOSE = re.compile(r'(?m)^\s*(\d{1,4})\s+(?=[^\W\d_])', re.UNICODE)
OPTM = re.compile(r'(?m)^\s*([a-h])\)\s?')

def norm(s):
    s = s.replace('\n', ' ')
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def parse(path):
    raw = load(path)
    body, keytext = split_body_key(raw)
    key = parse_key(keytext)
    body = strip_noise(body)

    # question starts, taken in ascending order
    cands = {}
    for m in QNUM.finditer(body):
        cands.setdefault(int(m.group(1)), []).append(m.start())
    loose = {}
    for m in QNUM_LOOSE.finditer(body):
        loose.setdefault(int(m.group(1)), []).append(m.start())
    marks, last = [], -1
    for n in range(1, 1001):
        pos = next((p for p in cands.get(n, []) if p > last), None)
        if pos is None:
            pos = next((p for p in loose.get(n, []) if p > last), None)
        if pos is None:
            continue
        marks.append((n, pos)); last = pos

    good, bad = [], []
    for i, (n, pos) in enumerate(marks):
        end = marks[i+1][1] if i + 1 < len(marks) else len(body)
        seg = body[pos:end]
        om = []
        want = 'a'
        for m in OPTM.finditer(seg):
            if m.group(1) == want:
                om.append(m)
                if want == 'h':
                    break
                want = chr(ord(want) + 1)
        if len(om) < 8:
            # The books contain a few mislabelled option lists (e.g. bio 470 runs
            # a,b,c,d,e,e,f,g and bio 588 has a stray "a)" in front of "h)").
            # Fall back to positional order: take the first 8 option markers,
            # which are printed in the order the answer key expects.
            allm = [m for m in OPTM.finditer(seg)]
            if len(allm) >= 8:
                om = allm[:8]
        pat = key.get(n)
        if len(om) != 8 or not pat:
            bad.append((n, len(om), 'nokey' if not pat else ''))
            continue
        stem = norm(re.sub(r'^\s*%d\.\s*' % n, '', seg[:om[0].start()]))
        opts = [norm(seg[om[j].end(): (om[j+1].start() if j + 1 < 8 else len(seg))])
                for j in range(8)]
        if not stem or any(not o for o in opts):
            bad.append((n, 8, 'blank stem' if not stem else 'blank opt'))
            continue
        good.append({"n": n, "q": stem, "opts": opts,
                     "ans": [k for k, c in enumerate(pat) if c == 'S'], "key": pat})
    return good, bad, key

if __name__ == '__main__':
    g, b, key = parse(sys.argv[1])
    print("key entries:", len(key), "good:", len(g), "bad:", len(b))
    print("bad:", b[:40])
    io.open(sys.argv[2], 'w', encoding='utf-8').write(json.dumps(g, ensure_ascii=False, indent=1))
