"""Fix wrong skip list comparison counts in quizzes_grouped.json."""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

GROUPED = r'C:\Users\Jergus\Downloads\jkuExams\src\quizzes_grouped.json'

CORRECT_TABLE = {
    "headers": ["search for", "comparisons"],
    "rows": [
        {"label": "9",              "cells": [{"v": "6", "e": True}]},
        {"label": "12",             "cells": [{"v": "5", "e": True}]},
        {"label": "21",             "cells": [{"v": "8", "e": True}]},
        {"label": "27 (not in list)","cells": [{"v": "9", "e": True}]},
    ]
}

CORRECT_EXPLANATION = """Search paths (each node visited = 1 comparison):

Find 9:
  -∞(S4) → -∞(S3) → -∞(S2) → 7(S2) → 7(S1) → 9(S1) = 6 comparisons

Find 12:
  -∞(S4) → -∞(S3) → 10(S3) → 10(S2) → 12(S2) = 5 comparisons

Find 21:
  -∞(S4) → -∞(S3) → 10(S3) → 10(S2) → 12(S2) → 18(S2) → 18(S1) → 21(S1) = 8 comparisons

Find 27 (not in list):
  -∞(S4) → -∞(S3) → 10(S3) → 10(S2) → 12(S2) → 18(S2) → 18(S1) → 21(S1) → 21(S0) = 9 comparisons
  (right of 21 at S0 is +∞ > 27 and we are at the bottom level → not found)"""

with open(GROUPED, encoding='utf-8') as f:
    data = json.load(f)

fixed = 0
for exam in data:
    for q in exam['questions']:
        ti = q.get('tableInput')
        if ti and ti.get('headers') == ['search for', 'comparisons']:
            q['tableInput'] = CORRECT_TABLE
            q['explanation'] = CORRECT_EXPLANATION
            fixed += 1
            print('Fixed: ' + exam['id'])

with open(GROUPED, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Done — fixed', fixed, 'questions')
