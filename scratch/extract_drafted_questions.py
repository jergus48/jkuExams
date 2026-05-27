import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = r"c:\Users\Jergus\Downloads\jkuExams\scratch_transcription_2.txt"
with open(path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Let's search for "q": or "opts": or "ans": or "explanation": in blocks
# Or search for any JSON-like lists that contain fields typical of our quizzes.
# Let's find occurrences of '"q":' or '"opts":' or '"ans":' or 'opts: \[' or 'ans: \['
# and print the surrounding blocks.

matches = list(re.finditer(r'("q"\s*:\s*|q\s*:\s*)"', content))
print("Found", len(matches), "occurrences of q field")

# Group matches by proximity and print unique question texts
seen_questions = set()
for i, m in enumerate(matches):
    start = max(0, m.start() - 100)
    end = min(len(content), m.start() + 1500)
    snippet = content[start:end]
    
    # Extract the question text
    q_match = re.search(r'("q"\s*:\s*|q\s*:\s*)"([^"\\]*(?:\\.[^"\\]*)*)"', snippet)
    if q_match:
        q_text = q_match.group(2)
        if q_text not in seen_questions:
            seen_questions.add(q_text)
            print(f"\n--- QUESTION DRAFT {len(seen_questions)} ---")
            print(snippet[:1200])
            print("="*60)
