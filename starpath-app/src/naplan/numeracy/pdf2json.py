import pdfplumber
import json
import re

filename = "./2016/e5-naplan-2016-final-test-numeracy-year-5.pdf"  # <-- put your PDF filename here
questions = []

with pdfplumber.open(filename) as pdf:
    for page_num, page in enumerate(pdf.pages, 1):
        text = page.extract_text()
        if not text:
            continue
        # Split into lines and look for question starts
        for line in text.split('\n'):
            match = re.match(r"^\s*(\d{1,2})\.\s*(.*)", line)
            if match:
                qnum = int(match.group(1))
                qtext = match.group(2)
                questions.append({
                    "id": qnum,
                    "page": page_num,
                    "raw": qtext
                })

with open("questions_raw.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Extracted {len(questions)} questions.")
