import json, re

with open(r'C:\Users\Jergus\Downloads\jkuExams\src\extracted\math_exams.json', encoding='utf-8') as f:
    raw = f.read()

PLACEHOLDER = '\x01DBLSLASH\x01'

# 1. protect already-correct \\ pairs
raw = raw.replace('\\\\', PLACEHOLDER)

# 2. double all remaining lone backslashes (invalid JSON escapes)
raw = raw.replace('\\', '\\\\')

# 3. restore
raw = raw.replace(PLACEHOLDER, '\\\\')

# 4. fix any literal form-feed bytes from \f being misinterpreted
raw = raw.replace('\x0c', '\\\\f')

try:
    data = json.loads(raw)
    print('Valid JSON!', len(data), 'quizzes')

    # Remove corrupted retake
    data = [q for q in data if q['id'] != 'math2_retake_2024']

    # Build clean retake
    def ti(rows):
        return {'headers': ['Part', 'Answer'],
                'rows': [{'label': r[0], 'cells': [{'v': r[1], 'e': True}]} for r in rows]}

    retake = {
        'id': 'math2_retake_2024',
        'title': 'Mathematics for AI 2 — Retake Exam 2024',
        'description': 'Curve analysis (x·ln x), limit with Taylor, integrals, IVT proof, multivariate stationary points',
        'questions': [
            {
                'context': 'Consider \\(f(x) := x \\cdot \\ln x\\).',
                'q': '(a) Domain \\(D\\) and zeros of \\(f\\).\n(b) Compute \\(\\lim_{x \\to 0^+} f(x)\\) and \\(\\lim_{x \\to \\infty} f(x)\\).\n(c) All local and global minima/maxima.\n(d) Sketch the graph.',
                'opts': [], 'ans': [], 'multi': False,
                'tableInput': ti([
                    ('Domain D', '(0, ∞)'),
                    ('Zero(s) of f', 'x = 1'),
                    ('lim x→0⁺', '0'),
                    ('lim x→∞', '+∞'),
                    ('x of global minimum', '1/e'),
                    ('Minimum value f(1/e)', '-1/e'),
                ]),
                'explanation': '**Domain:** \\(\\ln x\\) requires \\(x>0\\), so \\(D=(0,\\infty)\\).\n\n**Zeros:** \\(x\\ln x=0 \\Rightarrow \\ln x=0 \\Rightarrow x=1\\).\n\n**Limits:**\n- \\(\\lim_{x\\to 0^+} x\\ln x\\): write as \\(\\frac{\\ln x}{1/x}\\), L\'H\xf4pital: \\(\\frac{1/x}{-1/x^2}=-x\\to 0\\)\n- \\(\\lim_{x\\to\\infty} x\\ln x = +\\infty\\)\n\n**Derivative:** \\(f\'(x)=\\ln x+1=0 \\Rightarrow x=1/e\\). Since \\(f\'\'(x)=1/x>0\\), this is a **global minimum** with \\(f(1/e)=-1/e\\approx -0.368\\). No maximum.',
            },
            {
                'context': 'Let \\(\\omega \\in \\mathbb{R}_{>0}\\) be a constant.',
                'q': 'Compute: \\(\\displaystyle\\lim_{x \\to 0} \\dfrac{\\sin(\\omega x) - \\omega x}{x^3}\\)',
                'opts': [], 'ans': [], 'multi': False,
                'tableInput': ti([('Limit (in terms of ω)', '-ω³/6')]),
                'explanation': '**Taylor:** \\(\\sin(\\omega x)=\\omega x - \\frac{\\omega^3 x^3}{6}+O(x^5)\\)\n\nSo \\(\\sin(\\omega x)-\\omega x = -\\frac{\\omega^3 x^3}{6}+O(x^5)\\)\n\nDivide by \\(x^3\\) and take limit: \\(\\displaystyle\\lim_{x\\to 0}\\frac{\\sin(\\omega x)-\\omega x}{x^3} = -\\frac{\\omega^3}{6}\\)',
            },
            {
                'q': '(a) Calculate: \\(\\displaystyle\\int_0^{\\pi/2}\\bigl(\\sin^3(x)+1\\bigr)\\cos(x)\\,dx\\)',
                'opts': [], 'ans': [], 'multi': False,
                'tableInput': ti([('(a) Integral value', '5/4')]),
                'explanation': '**Sub:** \\(u=\\sin x\\), \\(du=\\cos x\\,dx\\), limits \\(0\\to 1\\).\n\n\\(\\displaystyle\\int_0^1(u^3+1)\\,du=\\left[\\frac{u^4}{4}+u\\right]_0^1=\\frac{1}{4}+1=\\frac{5}{4}\\)',
            },
            {
                'q': '(b) Calculate the improper integral: \\(\\displaystyle\\int_5^{\\infty}\\frac{6}{(x-1)(x-3)}\\,dx\\)',
                'opts': [], 'ans': [], 'multi': False,
                'tableInput': ti([('(b) Integral value', '3·ln(2)')]),
                'explanation': '**Partial fractions:** \\(\\frac{6}{(x-1)(x-3)}=\\frac{-3}{x-1}+\\frac{3}{x-3}\\)\n\n\\(\\displaystyle\\int_5^{\\infty}\\left(\\frac{-3}{x-1}+\\frac{3}{x-3}\\right)dx=\\left[3\\ln\\left|\\frac{x-3}{x-1}\\right|\\right]_5^{\\infty}\\)\n\n- \\(x\\to\\infty\\): \\(\\frac{x-3}{x-1}\\to 1\\), \\(\\ln 1=0\\)\n- \\(x=5\\): \\(3\\ln\\frac{2}{4}=-3\\ln 2\\)\n\nResult: \\(0-(-3\\ln 2)=3\\ln 2\\)',
            },
            {
                'q': 'Prove that \\(\\exists\\, x\\in[-1,1]\\) such that \\(xe^x = x^3+1\\). (Hint: IVT)',
                'opts': [], 'ans': [], 'multi': False,
                'explanation': '**Define** \\(g(x)=xe^x-x^3-1\\), continuous on \\([-1,1]\\).\n\n**Endpoints:**\n- \\(g(-1)=-e^{-1}+1-1=-1/e<0\\)\n- \\(g(1)=e-1-1=e-2>0\\)\n\n**IVT:** \\(g(-1)<0<g(1)\\) and \\(g\\) continuous \\(\\Rightarrow\\) \\(\\exists\\, x^*\\in(-1,1)\\) with \\(g(x^*)=0\\). \\(\\blacksquare\\)',
            },
            {
                'context': 'Let \\(\\Omega=\\{(x,y):x^2+y^2<9\\}\\) and \\(f(x,y)=(x^2-5)(y^2-4)+x^2(y-2)\\).',
                'q': '(a) Find all stationary points in \\(\\Omega\\).\n(b) Classify each (local min/max or saddle).',
                'opts': [], 'ans': [], 'multi': False,
                'tableInput': ti([
                    ('Stationary pt 1', '(0, 0)'),
                    ('Type at (0,0)', 'local max'),
                    ('f(0,0)', '20'),
                    ('Stationary pt 2', '(2, 2)'),
                    ('Type at (2,2)', 'saddle point'),
                    ('Stationary pt 3', '(-2, 2)'),
                    ('Type at (-2,2)', 'saddle point'),
                ]),
                'explanation': '**Expand:** \\(f=x^2y^2+x^2y-6x^2-5y^2+20\\)\n\n**Partials:**\n\\(f_x=2x(y+3)(y-2)\\)\n\\(f_y=x^2(2y+1)-10y\\)\n\n**\\(f_x=0\\):** \\(x=0\\), \\(y=2\\), or \\(y=-3\\)\n- \\(x=0\\Rightarrow f_y=-10y=0\\Rightarrow (0,0)\\) ✓\n- \\(y=2\\Rightarrow 5x^2=20\\Rightarrow x=\\pm2\\), points \\((\\pm2,2)\\) ✓ (inside Ω)\n- \\(y=-3\\Rightarrow x^2=6\\), but \\(6+9>9\\) ✗\n\n**Hessian at (0,0):** \\(H=\\begin{pmatrix}-12&0\\\\0&-10\\end{pmatrix}\\), \\(\\det H=120>0\\), \\(f_{xx}<0\\) → **local max**, \\(f(0,0)=20\\)\n\n**Hessian at (\\(\\pm2,2)\\):** \\(f_{xx}=0\\), \\(f_{xy}=\\pm20\\), \\(f_{yy}=-2\\); \\(\\det H=-400<0\\) → **saddle points**',
            },
        ]
    }

    data.append(retake)

    with open(r'C:\Users\Jergus\Downloads\jkuExams\src\extracted\math_exams.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Saved', len(data), 'quizzes.')
    print('Q2 check:', data[-1]['questions'][1]['q'][:80])

except json.JSONDecodeError as e:
    print('Still invalid:', e)
    lines = raw.split('\n')
    li = e.lineno - 1
    print('Line', e.lineno, ':', repr(lines[li][max(0,e.colno-30):e.colno+30]))
