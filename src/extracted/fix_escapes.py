"""Fix double-escaped backslashes in the mlpc_retake1 quiz block of App.jsx.
The extraction agent wrote `\\\\(` (4 chars in source -> string `\\(` -> rendered `\(`)
when it should have written `\\(` (2 chars in source -> string `\(` -> rendered `\`).
We collapse any run of exactly 4 backslashes down to 2 inside that block only.
"""
import re
from pathlib import Path

APP = Path(r"C:\Users\Jergus\Downloads\jkuExams\src\App.jsx")
src = APP.read_text(encoding="utf-8")

m = re.search(r'"id":\s*"mlpc_retake1"', src)
assert m, "mlpc_retake1 not found"

# Walk left to opening brace of the object containing the id
i = m.start()
depth = 0
start = None
while i >= 0:
    c = src[i]
    if c == '}':
        depth += 1
    elif c == '{':
        if depth == 0:
            start = i
            break
        depth -= 1
    i -= 1
assert start is not None

# Walk right to matching closing brace, respecting strings
j = start
depth = 0
in_str = False
esc = False
end = None
while j < len(src):
    c = src[j]
    if in_str:
        if esc:
            esc = False
        elif c == "\\":
            esc = True
        elif c == '"':
            in_str = False
    else:
        if c == '"':
            in_str = True
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                end = j + 1
                break
    j += 1
assert end is not None

block = src[start:end]
# Replace runs of >=4 backslashes with 2. (A single LaTeX needs 2 backslashes in JSON source.)
before = len(re.findall(r"\\{4}", block))
fixed = re.sub(r"\\{4}", r"\\\\", block)
after = len(re.findall(r"\\{4}", fixed))
print(f"4-backslash runs in mlpc_retake1: before={before}  after={after}")

src2 = src[:start] + fixed + src[end:]
APP.write_text(src2, encoding="utf-8")
print(f"wrote {len(src2)} chars to {APP}")
