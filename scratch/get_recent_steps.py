import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

log_path = r"C:\Users\Jergus\.gemini\antigravity-ide\brain\a89f46f6-0bed-4928-8049-1e11243fc27a\.system_generated\logs\transcript.jsonl"
with open(log_path, 'r', encoding='utf-8') as f:
    steps = [json.loads(line) for line in f]

for step in steps:
    idx = step.get('step_index')
    if 2490 <= idx <= 2535:
        print(f"=== STEP {idx} (source: {step.get('source')}, type: {step.get('type')}) ===")
        content = step.get('content', '')
        thinking = step.get('thinking', '')
        if thinking:
            print("THINKING:", thinking)
        if content:
            print("CONTENT:", content)
        print("="*80)
