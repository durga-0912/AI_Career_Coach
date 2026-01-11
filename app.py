from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are an AI Career Coach for college students.

Rules:
- Reply neatly in short points.
- Avoid long paragraphs.
- Use simple English or simple Tamil (spoken style).
- If user uses Tamil, reply in Tamil.
- If user uses English, reply in English.
- Give career guidance, resume help, interview tips.

Formatting:
- Use numbered or bullet points.
- Keep answers clean and readable.
"""

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message")

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_msg}
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    reply = response.choices[0].message.content
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run()
