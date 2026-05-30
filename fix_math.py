import json, re

# Read the corrupted file as raw text and fix it
with open(r'C:\Users\Jergus\Downloads\jkuExams\src\extracted\math_exams.json', encoding='utf-8') as f:
    raw = f.read()

# Fix 1: form-feed chars (\x0c) came from Python interpreting \f in \frac etc.
# In JSON string values, \x0c appears - replace with \\f so it renders as \f in LaTeX
raw = raw.replace('\x0c', '\\\\f')

# Fix 2: "1979" was PowerShell PID replacing $$ — convert back then to \( \)
# Pattern: "1979...1979" inside a JSON string value
# We need to handle this carefully - find 1979...1979 patterns inside strings
fixed_parts = []
i = 0
while i < len(raw):
    idx = raw.find('1979', i)
    if idx == -1:
        fixed_parts.append(raw[i:])
        break
    # Check it's not a real number (surrounded by digits)
    before = raw[idx-1] if idx > 0 else ''
    if before.isdigit():
        fixed_parts.append(raw[i:idx+4])
        i = idx + 4
        continue
    # Find the closing 1979
    end_idx = raw.find('1979', idx + 4)
    if end_idx == -1:
        fixed_parts.append(raw[i:])
        break
    inner = raw[idx+4:end_idx]
    fixed_parts.append(raw[i:idx])
    fixed_parts.append('\\\\(' + inner.strip() + '\\\\)')
    i = end_idx + 4

raw = ''.join(fixed_parts)

# Validate it parses
try:
    data = json.loads(raw)
    print('JSON valid after fixes,', len(data), 'quizzes')
except Exception as e:
    print('Still invalid:', e)
    # Find the problem area
    import re
    lines = raw.split('\n')
    for li, line in enumerate(lines):
        try:
            json.loads('["' + line + '"]')
        except json.JSONDecodeError as le:
            if 'escape' in str(le).lower():
                print(f'  Line {li+1}: {line[:120]}')
    exit(1)

# Remove old retake if present and rebuild it clean
data = [q for q in data if q['id'] != 'math2_retake_2024']

def ti(rows):
    return {'headers': ['Part', 'Answer'],
            'rows': [{'label': r[0], 'cells': [{'v': r[1], 'e': True}]} for r in rows]}

retake = {
    'id': 'math2_retake_2024',
    'title': 'Mathematics for AI 2 — Retake Exam 2024',
    'description': 'Curve analysis (x·ln x), limit with Taylor, integrals, IVT proof, multivariate stationary points',
    'questions': [
        {
            'context': 'Consider the function \\(f(x) := x \\cdot \\ln x\\) defined on its natural domain.',
            'q': '(a) Determine the domain \\(D\\) and zeros of \\(f\\).\n(b) Compute \\(\\lim_{x \\to 0^+} f(x)\\) and \\(\\lim_{x \\to \\infty} f(x)\\).\n(c) Find all local and global minima/maxima.\n(d) Sketch the graph.',
            'opts': [], 'ans': [], 'multi': False,
            'tableInput': ti([
                ('Domain D', '(0, ∞)'),
                ('Zero of f', 'x = 1'),
                ('lim x→0+', '0'),
                ('lim x→∞', '+∞'),
                ('x of global minimum', '1/e'),
                ('Minimum value f(1/e)', '-1/e'),
            ]),
            'explanation': '**Domain:** \\(\\ln x\\) requires \\(x > 0\\), so \\(D = (0, \\infty)\\).\n\n**Zeros:** \\(x \\ln x = 0 \\Rightarrow \\ln x = 0 \\Rightarrow x = 1\\).\n\n**Limits:**\n- \\(\\lim_{x \\to 0^+} x \\ln x\\): rewrite as \\(\\frac{\\ln x}{1/x}\\), L\'H\xf4pital: \\(\\frac{1/x}{-1/x^2} = -x \\to 0\\)\n- \\(\\lim_{x \\to \\infty} x \\ln x = +\\infty\\)\n\n**Derivative:** \\(f\'(x) = \\ln x + 1 = 0 \\Rightarrow x = 1/e\\)\n\nSince \\(f\'\'(x) = 1/x > 0\\), this is a **global minimum**: \\(f(1/e) = -1/e \\approx -0.368\\). No maximum.',
        },
        {
            'context': 'Let \\(\\omega \\in \\mathbb{R}_{>0}\\) be a constant.',
            'q': 'Compute the limit: \\(\\displaystyle\\lim_{x \\to 0} \\dfrac{\\sin(\\omega x) - \\omega x}{x^3}\\)',
            'opts': [], 'ans': [], 'multi': False,
            'tableInput': ti([('Limit value (in terms of ω)', '-ω³/6')]),
            'explanation': '**Taylor expansion** of \\(\\sin(\\omega x)\\):\n\\(\\sin(\\omega x) = \\omega x - \\frac{(\\omega x)^3}{6} + O(x^5)\\)\n\n**Subtract \\(\\omega x\\):**\n\\(\\sin(\\omega x) - \\omega x = -\\frac{\\omega^3 x^3}{6} + O(x^5)\\)\n\n**Divide by \\(x^3\\), take limit:**\n\\(\\displaystyle\\lim_{x \\to 0} \\frac{\\sin(\\omega x) - \\omega x}{x^3} = -\\frac{\\omega^3}{6}\\)',
        },
        {
            'q': 'Calculate: \\(\\displaystyle\\int_0^{\\pi/2} \\bigl(\\sin^3(x) + 1\\bigr)\\cos(x)\\,dx\\)',
            'opts': [], 'ans': [], 'multi': False,
            'tableInput': ti([('Integral value', '5/4')]),
            'explanation': '**Substitution:** \\(u = \\sin x\\), \\(du = \\cos x\\,dx\\). Limits: \\(0 \\to 1\\).\n\n\\(\\displaystyle\\int_0^1 (u^3+1)\\,du = \\left[\\frac{u^4}{4}+u\\right]_0^1 = \\frac{1}{4}+1 = \\frac{5}{4}\\)',
        },
        {
            'q': 'Calculate the improper integral: \\(\\displaystyle\\int_5^\\infty \\frac{6}{(x-1)(x-3)}\\,dx\\)',
            'opts': [], 'ans': [], 'multi': False,
            'tableInput': ti([('Integral value', '3·ln(2)')]),
            'explanation': '**Partial fractions:** \\(\\frac{6}{(x-1)(x-3)} = \\frac{-3}{x-1} + \\frac{3}{x-3}\\)\n\n(Solve: \\(x=3\\Rightarrow B=3\\); \\(x=1\\Rightarrow A=-3\\))\n\n\\(\\displaystyle\\int_5^\\infty \\left(\\frac{-3}{x-1}+\\frac{3}{x-3}\\right)dx = \\left[3\\ln\\left|\\frac{x-3}{x-1}\\right|\\right]_5^\\infty\\)\n\n- \\(x\\to\\infty\\): \\(\\frac{x-3}{x-1}\\to 1\\), \\(\\ln 1 = 0\\)\n- \\(x=5\\): \\(3\\ln\\frac{2}{4} = -3\\ln 2\\)\n\nResult: \\(0-(-3\\ln 2) = 3\\ln 2\\)',
        },
        {
            'q': 'Prove that there exists \\(x \\in [-1,1]\\) such that \\(xe^x = x^3 + 1\\). Hint: use the Intermediate Value Theorem.',
            'opts': [], 'ans': [], 'multi': False,
            'explanation': '**Define** \\(g(x) = xe^x - x^3 - 1\\), continuous on \\([-1,1]\\).\n\n**Evaluate endpoints:**\n- \\(g(-1) = -e^{-1} - (-1) - 1 = -1/e \\approx -0.368 < 0\\)\n- \\(g(1) = e - 1 - 1 = e-2 \\approx 0.718 > 0\\)\n\n**IVT:** Since \\(g(-1) < 0 < g(1)\\) and \\(g\\) is continuous, there exists \\(x^* \\in (-1,1)\\) with \\(g(x^*)=0\\). \\(\\blacksquare\\)',
        },
        {
            'context': 'Let \\(\\Omega = \\{(x,y) : x^2+y^2 < 9\\}\\) and \\(f(x,y) = (x^2-5)(y^2-4) + x^2(y-2)\\).',
            'q': '(a) Find all stationary points of \\(f\\) in \\(\\Omega\\).\n(b) Classify each as local min, local max, or saddle point.',
            'opts': [], 'ans': [], 'multi': False,
            'tableInput': ti([
                ('Stationary point 1', '(0, 0)'),
                ('Type at (0,0)', 'local max'),
                ('f(0,0)', '20'),
                ('Stationary point 2', '(2, 2)'),
                ('Type at (2,2)', 'saddle point'),
                ('Stationary point 3', '(-2, 2)'),
                ('Type at (-2,2)', 'saddle point'),
            ]),
            'explanation': '**Expand:** \\(f = x^2y^2 + x^2y - 6x^2 - 5y^2 + 20\\)\n\n**Partial derivatives:**\n\\(f_x = 2x(y+3)(y-2)\\)\n\\(f_y = x^2(2y+1) - 10y\\)\n\n**Setting \\(f_x=0\\):** \\(x=0\\), \\(y=2\\), or \\(y=-3\\)\n\n- \\(x=0 \\Rightarrow f_y=-10y=0 \\Rightarrow (0,0)\\) ✓\n- \\(y=2 \\Rightarrow 5x^2-20=0 \\Rightarrow x=\\pm2\\); points \\((\\pm2,2)\\) ✓ (inside Ω)\n- \\(y=-3 \\Rightarrow x^2=6\\); but \\(6+9=15>9\\), outside Ω ✗\n\n**Hessian at (0,0):** \\(f_{xx}=-12,\\; f_{xy}=0,\\; f_{yy}=-10\\)\n\\(\\det H = 120 > 0,\\; f_{xx}<0 \\Rightarrow\\) **local maximum**, \\(f(0,0)=20\\)\n\n**Hessian at (\\(\\pm\\)2, 2):** \\(f_{xx}=0,\\; f_{xy}=\\pm20,\\; f_{yy}=-2\\)\n\\(\\det H = -400 < 0 \\Rightarrow\\) **saddle points**',
        },
    ]
}

data.append(retake)

with open(r'C:\Users\Jergus\Downloads\jkuExams\src\extracted\math_exams.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Written', len(data), 'math quizzes')
print('Retake Q1:', data[-1]['questions'][1]['q'][:80])
