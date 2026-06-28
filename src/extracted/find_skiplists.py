import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open(r'C:\Users\Jergus\Downloads\jkuExams\src\extracted\algos_exams.json', encoding='utf-8') as f:
    data = json.load(f)
for exam in data:
    for i, q in enumerate(exam['questions']):
        ctx = q.get('context','') + q.get('q','')
        if 'S0:' in ctx or ('skip list' in ctx.lower() and 'S' in ctx):
            print('=== [' + exam['id'] + '] Q' + str(i+1) + ' ===')
            print(ctx[:600])
            print()
