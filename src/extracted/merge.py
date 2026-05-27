"""Merge extracted JSON quizzes back into App.jsx by replacing each quiz object
matched by its `id`, with brace-balanced replacement."""
import json, re, sys, io
from pathlib import Path

# Force UTF-8 output (Windows console codepage workaround)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(r"C:\Users\Jergus\Downloads\jkuExams")
APP = ROOT / "src" / "App.jsx"
EX = ROOT / "src" / "extracted"

# JSON files to merge
FILES = [
    "mlpc_ss20.json",
    "mlpc_ss22.json",
    "pip2_ss22.json",
    "python_ss2024.json",
    "ss2024_retry1.json",
    "mlpc_retake1.json",
    "pc_2023_retry.json",
]

src = APP.read_text(encoding="utf-8")

def find_quiz_block(text: str, qid: str):
    """Return (start, end) indices of the {...} object whose `"id": "<qid>"` is inside.
    Strategy: locate the id string, walk left to the nearest '{' that opens the object,
    then walk right counting braces to find the matching '}'.
    """
    needle = re.search(r'"id"\s*:\s*"' + re.escape(qid) + r'"', text)
    if not needle:
        return None
    # Walk left to find the opening '{' that starts this object
    i = needle.start()
    depth = 0
    while i >= 0:
        c = text[i]
        if c == '}': depth += 1
        elif c == '{':
            if depth == 0:
                start = i
                break
            depth -= 1
        i -= 1
    else:
        return None
    # Walk right from start to find matching '}'
    depth = 0
    in_str = False
    esc = False
    j = start
    while j < len(text):
        c = text[j]
        if in_str:
            if esc: esc = False
            elif c == '\\': esc = True
            elif c == '"': in_str = False
        else:
            if c == '"': in_str = True
            elif c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return (start, j + 1)
        j += 1
    return None

for fname in FILES:
    fpath = EX / fname
    if not fpath.exists():
        print(f"SKIP (missing): {fname}")
        continue
    data = json.loads(fpath.read_text(encoding="utf-8"))
    qid = data["id"]
    rng = find_quiz_block(src, qid)
    if not rng:
        print(f"WARN: could not locate block for id={qid}")
        continue
    start, end = rng
    # Serialize with indent matching surrounding context (2 spaces inside JSX array)
    new_block = json.dumps(data, indent=2, ensure_ascii=False)
    # Re-indent: each line gets prepended with "  " (the existing array item indent in App.jsx is 2 spaces before '{')
    indented = "\n".join(("  " + ln) if ln else ln for ln in new_block.splitlines())
    # Drop leading "  " from first line because the original block already has its leading indent at `start`
    indented = indented.lstrip()
    src = src[:start] + indented + src[end:]
    print(f"OK  replaced id={qid}  size={len(new_block)} bytes  questions={len(data.get('questions',[]))}")

APP.write_text(src, encoding="utf-8")
print(f"\nWrote {APP}  ({len(src)} chars)")
