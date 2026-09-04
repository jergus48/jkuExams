# -*- coding: utf-8 -*-
"""Build the medicine quiz bank from the two LF UK question books."""
import io, json, sys
sys.path.insert(0, 'scratch/med')
import parse_pdf as P

CHUNK = 50
LETTERS = "abcdefgh"

def collect(txt, figures_path=None):
    good, bad, key = P.parse(txt)
    qs = {q["n"]: {"q": "%d. %s" % (q["n"], q["q"]), "opts": q["opts"],
                   "ans": q["ans"], "multi": True} for q in good}
    if figures_path:
        for f in json.load(io.open(figures_path, encoding='utf-8')):
            qs[f["n"]] = {"q": "%d. %s" % (f["n"], f["q"]), "figures": f["figures"],
                          "opts": ["%s)" % c for c in LETTERS], "ans": f["ans"], "multi": True}
    return [qs[n] for n in sorted(qs)], sorted(set(range(1, 1001)) - set(qs))

def chunks(qs, subject, slug, srcdesc):
    out = []
    for i in range(0, len(qs), CHUNK):
        part = qs[i:i+CHUNK]
        lo = part[0]["q"].split(".")[0]
        hi = part[-1]["q"].split(".")[0]
        out.append({
            "id": "med_%s_%02d" % (slug, i // CHUNK + 1),
            "section": "medicina",
            "title": "%s — otázky %s–%s" % (subject, lo, hi),
            "description": "%s Otázky %s–%s. Označ všetky správne možnosti." % (srcdesc, lo, hi),
            "questions": part,
        })
    return out

chem, chem_miss = collect('scratch/med/chem.txt', 'scratch/med/chem_img.json')
bio, bio_miss = collect('scratch/med/bio.txt')
print("chémia:", len(chem), "otázok, chýba:", chem_miss)
print("biológia:", len(bio), "otázok, chýba:", bio_miss)

quizzes = (chunks(chem, "Chémia", "chem", "Prijímacie skúšky na LF UK — chémia (2024).")
           + chunks(bio, "Biológia", "bio", "Prijímacie skúšky na LF UK — biológia (2025)."))
io.open('src/med_quizzes.json', 'w', encoding='utf-8').write(
    json.dumps(quizzes, ensure_ascii=False, indent=1))
print(len(quizzes), "quizzes,", sum(len(q["questions"]) for q in quizzes), "questions")
