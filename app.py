from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os
import re

app = Flask(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are an AI Career Coach for college students.

Rules:
- Answer in simple points
- No markdown
- No symbols like ** ### ---
- Short, clear sentences
- Step by step guidance
- Friendly toneSTRICT 
- NEVER use markdown.
- DO NOT use **, ###, ##, -, or numbered lists.
- Write only plain text.
- Use short sentences.
- Max 5 points only.
- Each point in new line.
- Keep answers crisp and simple.

LANGUAGE:
- Prefer simple English.
- If user speaks Tamil, reply in Tamil.

BEHAVIOUR:
- Ask only ONE question at a time.
- Give focused career advice.
- No long explanations.
"""

def clean_text(text):
    # Remove markdown symbols
    text = re.sub(r"\*\*|###|##|#", "", text)
    text = re.sub(r"- ", "• ", text)
    return text.strip()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg}
        ]
    )

    reply = response.choices[0].message.content
    reply = clean_text(reply)

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)
