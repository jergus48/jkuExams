import json

def load(path):
    for enc in ('utf-8', 'utf-8-sig'):
        try:
            with open(path, encoding=enc) as f: return json.load(f)
        except: pass

with open(r'C:\Users\Jergus\Downloads\jkuExams\src\quizzes_grouped.json', encoding='utf-8') as f:
    data = json.load(f)

# Extract the 3 python kahoot quizzes
numpy_q    = next(q for q in data if q['id'] == 'python_kahoot_numpy')
matplot_q  = next(q for q in data if q['id'] == 'python_kahoot_matplotlib')
pandas_q   = next(q for q in data if q['id'] == 'python_kahoot_pandas')

# Remove them
data = [q for q in data if q['id'] not in
        ('python_kahoot_numpy', 'python_kahoot_matplotlib', 'python_kahoot_pandas')]

# Merge into one
combined_python_kahoot = {
    "id": "python_kahoot",
    "title": "Python Kahoot — NumPy, Matplotlib & Pandas",
    "description": "Array shapes, broadcasting, indexing, matplotlib/seaborn, DataFrames, loc/iloc, groupby",
    "questions": numpy_q['questions'] + matplot_q['questions'] + pandas_q['questions']
}

data.append(combined_python_kahoot)

with open(r'C:\Users\Jergus\Downloads\jkuExams\src\quizzes_grouped.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

total_q = len(combined_python_kahoot['questions'])
print(f'Done — {len(data)} quizzes, Python Kahoot has {total_q} questions')
