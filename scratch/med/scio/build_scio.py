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
        # Riadky bez zadania su len parkovacie miesta pre rozptylovace
        # (moznosti navyse, ktore sa nikam nepriradzuju).
        pairs = [p for p in q["pairs"] if p["l"] or p["limg"]]
        if not pairs:
            return None
        figs = list(base.get("figures", []))

        # Priradovane polozky su obrazky: ocisluju sa v poradi, v akom ich
        # student vidi, a odpoved je cislo obrazka.
        if any(not p["r"] for p in pairs):
            order = [c["img"] for c in q.get("choices", []) if c.get("img")]
            if not order or any(not p["rimg"] for p in pairs):
                return None
            num = {img: i + 1 for i, img in enumerate(order)}
            for img in order:
                if img not in figs:
                    figs.append(img)
            rows = []
            for p in pairs:
                if not p["l"] or p["rimg"] not in num:
                    return None
                rows.append((p["l"], str(num[p["rimg"]])))
            base["figures"] = figs
            base.update({"q": text + " (napíš číslo obrázka)",
                         "tableInput": table(["Zadanie", "Obrázok č."], rows)})
            return base

        # Zadanie moze byt obrazok: obrazky idu medzi figures v poradi riadkov
        # a riadok sa oznaci "Obrázok N".
        rows, nimg = [], 0
        for p in pairs:
            if p["l"]:
                rows.append((p["l"], p["r"]))
            elif p["limg"]:
                nimg += 1
                if p["limg"] not in figs:
                    figs.append(p["limg"])
                rows.append(("Obrázok %d" % nimg, p["r"]))
            else:
                return None
        if figs:
            base["figures"] = figs
        base.update({"q": text,
                     "tableInput": table(["Zadanie", "Priradenie"], rows)})
        return base

    if q["type"] == "sorting":
        if not q.get("reliable") or not q.get("order") or \
                any(not t for t in q["order"]):
            return None
        rows = [("%d." % (i + 1), t) for i, t in enumerate(q["order"])]
        base.update({"q": text + " (napíš poradie)",
                     "tableInput": table(["Poradie", "Krok"], rows)})
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
