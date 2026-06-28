"""Replace ASCII art skip list in context with structured skipList field."""
import json, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

GROUPED = r'C:\Users\Jergus\Downloads\jkuExams\src\quizzes_grouped.json'

# Structured data for the skip list shown in algos_exam_2023 Q2 and algos_exam_comprehensive Q2
# S4..S0 from top to bottom; each sub-array = nodes in that level (including sentinels)
SKIP_LIST_DATA = {
    "levels": [
        ["-∞", "+∞"],
        ["-∞", "10", "+∞"],
        ["-∞", "7", "10", "12", "18", "+∞"],
        ["-∞", "7", "9", "10", "12", "15", "18", "21", "+∞"],
        ["-∞", "7", "9", "10", "11", "12", "15", "18", "21", "+∞"]
    ]
}

with open(GROUPED, encoding='utf-8') as f:
    data = json.load(f)

fixed = 0
for exam in data:
    for q in exam['questions']:
        ctx = q.get('context', '')
        if 'S0' in ctx and 'S4' in ctx and '```' in ctx:
            # Strip the fenced code block (the ASCII art) from context
            new_ctx = re.sub(r'```[\s\S]*?```\n?', '', ctx).strip()
            q['context'] = new_ctx
            q['skipList'] = SKIP_LIST_DATA
            fixed += 1
            print('Fixed: ' + exam['id'])

with open(GROUPED, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Done — fixed {fixed} questions in {GROUPED}')
