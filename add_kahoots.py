import json

def load(path):
    for enc in ('utf-8', 'utf-8-sig'):
        try:
            with open(path, encoding=enc) as f: return json.load(f)
        except: pass

# ── 1. Python Kahoot: NumPy ──────────────────────────────────────────
numpy_kahoot = {
    "id": "python_kahoot_numpy",
    "title": "Python Kahoot — NumPy",
    "description": "Array shapes, broadcasting, indexing, memory layout, axis operations",
    "questions": [
        {
            "q": "What does shape `(3, 4)` represent?",
            "opts": ["7 total axes", "3 rows, 4 columns", "4 rows, 3 columns", "3 columns only"],
            "ans": [1], "multi": False,
            "explanation": "NumPy shape is always `(rows, columns)` for 2D arrays, so `(3, 4)` = 3 rows and 4 columns."
        },
        {
            "context": "```python\nimport numpy as np\na = np.array(range(6), dtype=float).reshape(2, 3)\nb = a.reshape(a.size)\nb[0] = 99\nprint(a[0, 0])\n```",
            "q": "What is printed?",
            "opts": ["0.0", "1.0", "99.0", "An error occurs"],
            "ans": [2], "multi": False,
            "explanation": "`reshape` returns a **view** of the same data, not a copy. So `b[0] = 99` modifies the underlying array and `a[0, 0]` also becomes `99.0`."
        },
        {
            "context": "```python\nimport numpy as np\na = np.arange(24).reshape(2, 3, 4)\ns = np.sum(a, axis=(0, 1))\nprint(s.shape)\n```",
            "q": "What is the shape of `s`?",
            "opts": ["(2, 3)", "(4,)", "(3, 4)", "()"],
            "ans": [1], "multi": False,
            "explanation": "Summing over axes 0 and 1 (of sizes 2 and 3) collapses those dimensions, leaving only axis 2 (size 4). Result shape: `(4,)`."
        },
        {
            "q": "Which shape pair is **NOT** broadcast-compatible?",
            "opts": ["(5, 3) and (3,)", "(5, 3) and (1, 3)", "(5, 3) and (5, 1)", "(5, 3) and (4,)"],
            "ans": [3], "multi": False,
            "explanation": "Broadcasting aligns shapes from the right. `(4,)` vs `(5, 3)`: the trailing dims are `4` vs `3` — neither is 1, so they're incompatible."
        },
        {
            "q": "Why are NumPy arrays typically faster than Python lists?",
            "opts": ["They are stored as nested objects", "They store references to Python objects", "Their elements are stored in contiguous memory blocks", "They automatically use GPU acceleration"],
            "ans": [2], "multi": False,
            "explanation": "NumPy arrays store homogeneous data in a single contiguous block of memory, enabling efficient vectorized C-level operations. Python lists store pointers to separate objects scattered in memory."
        },
        {
            "q": "What does the `axis` parameter in NumPy functions usually refer to?",
            "opts": ["The data type of elements", "The memory address", "The dimension along which an operation is applied", "The size of the array"],
            "ans": [2], "multi": False,
            "explanation": "`axis=0` operates along rows (collapses rows), `axis=1` along columns, etc. It specifies *which dimension* the operation reduces or iterates over."
        },
        {
            "context": "```python\nimport numpy as np\na = np.array([[10, 20, 30],\n              [40, 50, 60]])\nprint(a[1, 2])\n```",
            "q": "What value is printed?",
            "opts": ["30", "40", "50", "60"],
            "ans": [3], "multi": False,
            "explanation": "`a[1, 2]` = row index 1, column index 2 = second row `[40, 50, 60]`, third element = **60**."
        },
        {
            "context": "```python\nimport numpy as np\na = np.ones((3, 4))\nb = np.ones((4,))\na + b\n```",
            "q": "What is the result shape?",
            "opts": ["(4,)", "(3, 1)", "(3, 4)", "The code will raise an error"],
            "ans": [2], "multi": False,
            "explanation": "`b` shape `(4,)` broadcasts to `(1, 4)` then to `(3, 4)` to match `a`. Result shape is `(3, 4)`."
        },
        {
            "q": "What does dimension `-1` mean when reshaping arrays?",
            "opts": ["Infers the size automatically", "Transposes the array", "Flattens the array", "Inserts new axis after the last dimension"],
            "ans": [0], "multi": False,
            "explanation": "Passing `-1` in `reshape` tells NumPy to automatically calculate that dimension's size based on the total number of elements and the other specified dimensions."
        },
        {
            "q": "Which indexing selects column index 2 of array `arr`?",
            "opts": ["arr[:, 2]", "arr[:, 1:2]", "arr[2]", "arr[2, :]"],
            "ans": [0], "multi": False,
            "explanation": "`arr[:, 2]` means *all rows* (`:`) and column index 2. `arr[2]` / `arr[2, :]` would select row 2 instead."
        },
        {
            "q": "Which function returns the **index position** of the maximum element in the flattened array?",
            "opts": ["np.max", "np.where", "np.unravel_index", "np.argmax"],
            "ans": [3], "multi": False,
            "explanation": "`np.argmax(a)` returns the flat index of the largest element. `np.max` returns the value itself. `np.unravel_index` converts a flat index to multi-dimensional coordinates."
        },
    ]
}

# ── 2. Python Kahoot: Matplotlib & Seaborn ───────────────────────────
matplotlib_kahoot = {
    "id": "python_kahoot_matplotlib",
    "title": "Python Kahoot — Matplotlib & Seaborn",
    "description": "Figures, axes, backends, PNG vs lossy formats, seaborn use cases",
    "questions": [
        {
            "q": "What is a key property of PNG images?",
            "opts": ["They use lossy compression", "They are always interactive", "They use lossless compression", "They store only grayscale information"],
            "ans": [2], "multi": False,
            "explanation": "PNG uses lossless compression — no image data is discarded. JPEG uses lossy compression, which reduces file size at the cost of image quality."
        },
        {
            "q": "The `seaborn` module is typically used for what?",
            "opts": ["Statistical visualizations", "In a web development context", "When interactivity is required", "They are required when plotting in Jupyter Notebooks"],
            "ans": [0], "multi": False,
            "explanation": "Seaborn is a high-level statistical data visualization library built on matplotlib. It simplifies creating plots like distributions, heatmaps, and regression plots."
        },
        {
            "q": "What is an `Axes` object in matplotlib?",
            "opts": ["The plotting area where data is drawn", "The image file format used for saving plots", "The backend rendering engine", "The grid layout manager"],
            "ans": [0], "multi": False,
            "explanation": "A matplotlib `Axes` is the region of the figure containing the actual plot — including the data, axis labels, ticks, and title. A `Figure` can contain multiple `Axes`."
        },
        {
            "q": "Why might matplotlib plots look different on different operating systems?",
            "opts": ["Different Python syntax rules", "Different matplotlib backends are used", "Images are stored in different formats", "The plotting functions are different"],
            "ans": [1], "multi": False,
            "explanation": "Matplotlib uses *backends* (e.g. TkAgg, Qt5Agg, Agg) for rendering. Different OS environments may default to different backends, affecting fonts, DPI, and rendering."
        },
        {
            "context": "```python\nimport matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [1, 4, 9])\nplt.show()\n```",
            "q": "What will this code produce?",
            "opts": ["A scatter plot with 3 points", "A bar chart", "A line plot connecting the points", "Nothing (missing figure object)"],
            "ans": [2], "multi": False,
            "explanation": "`plt.plot()` creates a **line plot** by default, connecting the given x/y points. No `Figure` object needs to be explicitly created — `pyplot` manages one implicitly."
        },
        {
            "context": "```python\nimport matplotlib.pyplot as plt\nfig, ax = plt.subplots(1, 2)\nax.plot([1, 2], [3, 4])\n```",
            "q": "What is the problem in this code?",
            "opts": ["plot() requires 3 arguments", "ax is a list/array of axes, not a single axis", "subplots cannot create multiple plots", "The figure must be shown first"],
            "ans": [1], "multi": False,
            "explanation": "`plt.subplots(1, 2)` returns an **array** of 2 `Axes` objects. Calling `.plot()` directly on the array fails — you need `ax[0].plot(...)` or `ax[1].plot(...)`."
        },
        {
            "q": "True or false: the `seaborn` library is built on top of `matplotlib`.",
            "opts": ["True", "False"],
            "ans": [0], "multi": False,
            "explanation": "True. Seaborn is a higher-level wrapper around matplotlib. It uses matplotlib figures and axes internally and you can always access the underlying matplotlib objects for further customization."
        },
    ]
}

# ── 3. Python Kahoot: Pandas ─────────────────────────────────────────
pandas_kahoot = {
    "id": "python_kahoot_pandas",
    "title": "Python Kahoot — Pandas",
    "description": "DataFrames, loc/iloc, groupby, transform/apply/map, conditional assignment",
    "questions": [
        {
            "q": "Why can a Pandas DataFrame contain columns with different data types, unlike a typical NumPy array?",
            "opts": [
                "Because Pandas automatically converts all columns to strings",
                "Because each row is stored as a separate NumPy array",
                "Because each column is internally stored as a separate Series/array",
                "Because Pandas does not use NumPy internally"
            ],
            "ans": [2], "multi": False,
            "explanation": "Each DataFrame column is a `Series`, backed by its own NumPy array with its own dtype. This is why column dtypes can differ — each column is independent."
        },
        {
            "context": "```python\ndf = pd.DataFrame({'x': [1, 2, 3], 'y': [10, 20, 30]})\ndf.loc[df['x'] > 1, 'y'] = 99\nprint(df['y'].tolist())\n```",
            "q": "What will be printed?",
            "opts": ["[10, 20, 30]", "[99, 99, 99]", "[10, 99, 99]", "Error, because loc cannot assign values"],
            "ans": [2], "multi": False,
            "explanation": "`df['x'] > 1` is `[False, True, True]`. So `loc` sets `y` to 99 only for rows 1 and 2. Row 0 (x=1) stays at 10. Result: `[10, 99, 99]`."
        },
        {
            "q": "What is the key difference between `loc` and `iloc`?",
            "opts": [
                "`loc` uses integer positions, `iloc` uses labels",
                "`loc` uses labels, `iloc` uses integer positions",
                "`loc` only works for columns, `iloc` only for rows",
                "`iloc` includes the upper boundary, `loc` excludes it"
            ],
            "ans": [1], "multi": False,
            "explanation": "`loc` is **label-based** (uses index names/column names). `iloc` is **position-based** (uses integer positions 0, 1, 2...). Note: `loc` slicing includes the endpoint, `iloc` excludes it."
        },
        {
            "context": "```python\ndf = pd.DataFrame({'group': ['A', 'A', 'B'], 'value': [1, 3, 10]})\nresult = df.groupby('group')['value'].sum()\nprint(result.loc['A'])\n```",
            "q": "What will be printed?",
            "opts": ["1", "3", "4", "10"],
            "ans": [2], "multi": False,
            "explanation": "Group A has values 1 and 3, which sum to **4**. `result.loc['A']` looks up the sum for group A in the resulting Series."
        },
        {
            "q": "What is special about slicing with `df.loc['r1':'r4']`?",
            "opts": [
                "The upper boundary 'r4' is included",
                "The upper boundary 'r4' is excluded",
                "It only works if the index is numeric",
                "It always returns a NumPy array"
            ],
            "ans": [0], "multi": False,
            "explanation": "Unlike Python list slicing or `iloc`, **`loc` label slicing is inclusive on both ends**. `df.loc['r1':'r4']` includes rows with label 'r1' through 'r4' inclusive."
        },
        {
            "q": "Which statement about selecting a single column from a DataFrame is correct?",
            "opts": ["It returns a DataFrame", "It returns a Series", "It returns a dictionary", "It returns a list"],
            "ans": [1], "multi": False,
            "explanation": "`df['column_name']` returns a **Series**. To get a DataFrame back (1-column), use `df[['column_name']]` with double brackets."
        },
        {
            "q": "Which command is the **safest** way to assign a value to rows matching a condition?",
            "opts": [
                "df[df['x'] > 0]['y'] = 1",
                "df.query('x > 0')['y'] = 1",
                "df.loc[df['x'] > 0, 'y'] = 1",
                "df.iloc[df['x'] > 0, 'y'] = 1"
            ],
            "ans": [2], "multi": False,
            "explanation": "`df.loc[condition, col] = value` modifies the original DataFrame directly and safely. The other options may trigger a `SettingWithCopyWarning` or fail, because they operate on copies."
        },
        {
            "q": "Which of these statements about `transform` / `apply` / `map` is correct?",
            "opts": [
                "`apply` can only be used with Series",
                "`map` is an in-place operation",
                "`transform` returns a DataFrame of the same shape as the original",
                "`transform` can only work with strings"
            ],
            "ans": [2], "multi": False,
            "explanation": "`transform` applies a function and **preserves the original index/shape**, making it useful inside `groupby` to broadcast group-level results back to the original rows. `apply` is more flexible but may change the shape."
        },
    ]
}

# ── 4. Hands on AI Kahoot: Language Models ───────────────────────────
lm_kahoot = {
    "id": "hoai_kahoot_lm",
    "title": "Hands on AI Kahoot — Language Models & Attention",
    "description": "Autoregressive LMs, embeddings, tokenization, RNN decoder, attention mechanism, NLL loss",
    "questions": [
        {
            "q": "What does \\(P(x_{(t+1)} \\mid x_{(t)}, \\ldots, x_{(1)})\\) represent?",
            "opts": [
                "Embeddings for every word in the corpus",
                "Probability of the previous token",
                "Probability distribution over the next token",
                "Similarity between embeddings"
            ],
            "ans": [2], "multi": False,
            "explanation": "This is the conditional probability of the **next token** given all previous tokens — the core quantity that a language model learns to predict."
        },
        {
            "q": "What is cosine similarity commonly used for with embeddings?",
            "opts": [
                "Measuring sentence depth",
                "Comparing vector directions",
                "Normalizing token frequencies",
                "Computing the RNN state"
            ],
            "ans": [1], "multi": False,
            "explanation": "Cosine similarity measures the **angle** between two vectors, ignoring magnitude. It's used to compare semantic similarity of embeddings — two vectors pointing in the same direction are similar."
        },
        {
            "q": "What trade-off does subword tokenization mainly introduce?",
            "opts": [
                "Accuracy vs. optimizer choice",
                "Vocabulary size vs. sequence length",
                "Embedding size vs. hidden size",
                "Heads vs. batch size"
            ],
            "ans": [1], "multi": False,
            "explanation": "Larger vocabulary → shorter sequences (fewer tokens per word), but larger embedding matrix. Smaller vocabulary → longer sequences with more subword pieces. BPE and WordPiece balance this trade-off."
        },
        {
            "q": "What is the role of the embedding matrix \\(E\\) in a language model?",
            "opts": [
                "Map hidden states to probabilities",
                "Map token IDs to dense vectors",
                "Store recurrence weights",
                "Compute the softmax"
            ],
            "ans": [1], "multi": False,
            "explanation": "The embedding matrix \\(E \\in \\mathbb{R}^{|V| \\times d}\\) maps each discrete token ID (an integer) to a dense continuous vector of dimension \\(d\\). It's learned during training."
        },
        {
            "q": "What does the decoder's linear layer map in an RNN language model?",
            "opts": [
                "Vocabulary size to sequence length",
                "Hidden state to vocabulary-size logits",
                "Tokens to hidden states",
                "Loss values to probabilities"
            ],
            "ans": [1], "multi": False,
            "explanation": "The output (projection) layer maps the hidden state \\(h_t \\in \\mathbb{R}^d\\) to logits over the entire vocabulary \\(\\in \\mathbb{R}^{|V|}\\). Softmax then converts these to probabilities."
        },
        {
            "q": "Which condition is typically required for weight tying?",
            "opts": [
                "Only full-word vocabulary",
                "Embedding and hidden sizes match",
                "No softmax is used",
                "Corpus sorted alphabetically"
            ],
            "ans": [1], "multi": False,
            "explanation": "Weight tying shares the embedding matrix \\(E\\) with the output projection layer. This requires \\(d_{\\text{embed}} = d_{\\text{hidden}}\\) so the matrix dimensions are compatible."
        },
        {
            "q": "What does negative log-likelihood (NLL) penalize during LM training?",
            "opts": [
                "Low probability assigned to the correct next token",
                "Too many vocabulary items",
                "Long contexts",
                "Repeated generated words"
            ],
            "ans": [0], "multi": False,
            "explanation": "NLL = \\(-\\log P(\\text{correct token})\\). When the model assigns **low probability** to the true next token, \\(-\\log\\) of that small number is large — so the loss is high, penalizing the model."
        },
        {
            "q": "If correct next tokens get higher probability, what happens to NLL?",
            "opts": ["It increases", "It stays constant", "It decreases", "It becomes undefined"],
            "ans": [2], "multi": False,
            "explanation": "Higher probability \\(p\\) for the correct token → \\(-\\log p\\) decreases (since \\(\\log p\\) increases toward 0). Lower NLL means the model is improving."
        },
        {
            "q": "Why is text generation with an LM called **autoregressive**?",
            "opts": [
                "Generated tokens become later inputs",
                "All positions update at once",
                "The vocabulary changes every token",
                "The model has no hidden states"
            ],
            "ans": [0], "multi": False,
            "explanation": "Each newly generated token is appended to the input and fed back into the model to predict the next one. The output **auto**matically becomes part of the **regressed** input — hence autoregressive."
        },
        {
            "q": "In scaled dot-product attention, what are queries and keys used for?",
            "opts": [
                "Producing vocabulary probabilities",
                "Determining attention scores",
                "Storing generated text",
                "Replacing value vectors"
            ],
            "ans": [1], "multi": False,
            "explanation": "Attention scores = \\(\\text{softmax}(QK^T / \\sqrt{d_k})\\). The **dot product of queries and keys** measures how relevant each key position is to a given query, producing the attention weights."
        },
        {
            "q": "Why is masking used in decoder self-attention during training?",
            "opts": [
                "To prevent attention to future tokens",
                "To remove unimportant words",
                "To make all attention weights equal",
                "To avoid using embeddings"
            ],
            "ans": [0], "multi": False,
            "explanation": "During training, all target tokens are available in parallel. The **causal mask** sets future positions to \\(-\\infty\\) before softmax, so the model cannot 'cheat' by attending to tokens it shouldn't have seen yet."
        },
    ]
}

# ── Merge into quizzes_grouped.json ──────────────────────────────────
import re

with open(r'C:\Users\Jergus\Downloads\jkuExams\src\App.jsx', encoding='utf-8') as f:
    content = f.read()
start = content.find('"id": "pc_2023_retry"')
obj_start = content.rfind('{', 0, start)
depth, i = 0, obj_start
while i < len(content):
    if content[i] == '{': depth += 1
    elif content[i] == '}':
        depth -= 1
        if depth == 0: obj_end = i+1; break
    i += 1
pc = json.loads(content[obj_start:obj_end])

algos = load(r'C:\Users\Jergus\Downloads\jkuExams\src\extracted\algos_exams.json')
stats = load(r'C:\Users\Jergus\Downloads\jkuExams\src\extracted\stats_exams.json')
math  = load(r'C:\Users\Jergus\Downloads\jkuExams\src\extracted\math_exams.json')

combined = ([pc] + algos + stats + math +
            [numpy_kahoot, matplotlib_kahoot, pandas_kahoot, lm_kahoot])

with open(r'C:\Users\Jergus\Downloads\jkuExams\src\quizzes_grouped.json', 'w', encoding='utf-8') as f:
    json.dump(combined, f, ensure_ascii=False, indent=2)

print(f'Done — {len(combined)} quizzes total')
for q in combined[-4:]:
    print(f"  {q['id']}: {len(q['questions'])} questions")
