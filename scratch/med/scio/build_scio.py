# -*- coding: utf-8 -*-
"""Prevedie scio_bio.json / scio_chem.json do formatu kvizov aplikacie
a zapise src/scio_quizzes.json. Jedna lekcia = jeden kviz."""
import io, os, json

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
OUT = os.path.join(ROOT, "src", "scio_quizzes.json")

# Nazvy musia obsahovat "Biologia SCIO" / "Chemia SCIO", lebo getSubject()
# v App.jsx z nich odvodzuje filtrovacie chipy.
SUBJECTS = {
    "bio": ("Biológia SCIO", "scio_bio"),
    "chem": ("Chémia SCIO", "scio_chem"),
}


def table(headers, rows):
    return {"headers": headers,
            "rows": [{"label": lab, "cells": [{"v": val, "e": True}]}
                     for lab, val in rows]}


def convert_matching(q, base, text):
    """Priradovacia otazka: riadok so zadanim + vyber z ponuky, ako na Sciu.
    Ponuka je v poradi, v akom polozky vidi student (vratane rozptylovacov)."""
    rows = [p for p in q["pairs"] if p["l"] or p["limg"]]
    if not rows:
        return None

    # Obrazky riadkov aj moznosti vykresluje widget priamo, do figures nejdu.
    options = []
    for c in q.get("choices", []):
        if c.get("text"):
            options.append({"t": c["text"]})
        elif c.get("img"):
            options.append({"img": c["img"]})
        else:
            return None
    if not options:
        return None

    def index_of(p):
        for i, c in enumerate(q.get("choices", [])):
            if p["rimg"] and c.get("img") == p["rimg"]:
                return i
            if p["r"] and not p["rimg"] and c.get("text") == p["r"]:
                return i
        return None

    out_rows, ans = [], []
    for p in rows:
        i = index_of(p)
        if i is None:
            return None
        row = {"label": p["l"]}
        if p["limg"]:
            row["img"] = p["limg"]
        out_rows.append(row)
        ans.append(i)

    base.update({"q": text,
                 "matching": {"rows": out_rows, "options": options, "ans": ans}})
    return base


def convert(q):
    """Vrati otazku v formate appky, alebo None ked sa neda spolahlivo previest."""
    base = {}
    if q.get("figures"):
        base["figures"] = q["figures"]
    if q.get("explanation"):
        base["explanation"] = q["explanation"]
    text = "%d. %s" % (q["n"], q["q"])

    if q["type"] == "choice":
        if not q["opts"] or not q["ans"]:
            return None
        base.update({"q": text, "opts": q["opts"], "ans": q["ans"],
                     "multi": bool(q["multi"])})
        return base

    if q["type"] == "matching":
        return convert_matching(q, base, text)

    if q["type"] == "sorting":
        if not q.get("reliable") or not q.get("order") or \
                any(not t for t in q["order"]):
            return None
        # Ponuka v abecednom poradi, aby neprezradzala spravne poradie.
        options = sorted(q["order"])
        base.update({"q": text,
                     "matching": {
                         "rows": [{"label": "%d." % (i + 1)}
                                  for i in range(len(q["order"]))],
                         "options": [{"t": t} for t in options],
                         "ans": [options.index(t) for t in q["order"]],
                         "prompt": "Zoraď"}})
        return base

    if q["type"] == "open":
        answers = [a for a in q.get("answers", []) if a]
        if not answers:
            return None
        rows = [("Odpoveď" if len(answers) == 1 else "Odpoveď %d" % (i + 1), a)
                for i, a in enumerate(answers)]
        base.update({"q": text, "tableInput": table(["", "Hodnota"], rows)})
        return base

    return None


def main():
    quizzes, skipped, total = [], [], 0
    for slug, (subject, prefix) in SUBJECTS.items():
        data = json.load(io.open(os.path.join(HERE, "scio_%s.json" % slug),
                                 encoding="utf-8"))
        for lesson in data["lessons"]:
            qs = []
            for q in lesson["questions"]:
                total += 1
                c = convert(q)
                if c is None:
                    skipped.append("%s / %s / otazka %d (%s)"
                                   % (subject, lesson["name"], q["n"], q["type"]))
                    continue
                qs.append(c)
            if not qs:
                continue
            quiz = {
                "id": "%s_%s" % (prefix, lesson["wb"]),
                "section": "medicina",
                "title": "%s — %s" % (subject, lesson["name"]),
                "description": "%s · Scio online príprava na lekárske fakulty."
                               % lesson["section"],
                "questions": qs,
            }
            if lesson.get("theory"):
                quiz["theory"] = lesson["theory"]
            if lesson.get("theory_figures"):
                quiz["theoryFigures"] = lesson["theory_figures"]
            quizzes.append(quiz)

    io.open(OUT, "w", encoding="utf-8").write(
        json.dumps(quizzes, ensure_ascii=False, indent=1))
    print("%s\n  %d kvizov, %d otazok (z %d), %d preskocenych"
          % (OUT, len(quizzes), sum(len(q["questions"]) for q in quizzes),
             total, len(skipped)))
    for s in skipped:
        print("   preskocene:", s)


if __name__ == "__main__":
    main()
