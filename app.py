user_profile = {
    "degree": None,
    "skills": None,
    "interest": None
}
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os

app = Flask(__name__)

# OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Chat memory (limited for speed)
chat_history = []
MAX_HISTORY = 4

# SYSTEM PROMPT (IMPORTANT)
SYSTEM_PROMPT = """
You are an AI Career Coach for college students.

General rules:
- Give short and clear answers.
- Limit responses to 5 to 6 bullet points.
- Avoid long paragraphs.
- Be concise and practical.
- Do not use markdown symbols.

Career guidance:
- If this is the first interaction, ask about the user's degree, skills, and interests.
- Suggest suitable career paths based on their answers.
- Guide step by step.

Interview mode:
- If the user asks for interview practice or says "take my interview",
  act like a real interviewer.
- Ask one interview question at a time.
- Wait for the user's answer before asking the next question.
- Give short feedback after each answer.
- Continue until the user says stop.

Conversation flow:
- Do not ask multiple questions in one message.
- Ask only one question at a time.
- Start by asking the user's degree.
- After the user answers, ask about their skills.
- After that, ask about their interests.
- Only after collecting all three, give career suggestions.

Career-specific interview:
- If the user selects a specific career (e.g., Python Developer),
  start a mock interview for that role.
- Ask technical and HR questions related only to the selected career.
- Ask one question at a time.
- After each answer, give short feedback.
- Continue until the user says stop.

"""

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")
    chat_history.append({"role": "user", "content": user_message})

    msg = user_message.lower()

    if user_profile["degree"] is None:
        if "bca" in msg or "bsc" in msg or "be" in msg or "btech" in msg:
            user_profile["degree"] = user_message

    elif user_profile["skills"] is None:
        user_profile["skills"] = user_message

    elif user_profile["interest"] is None:
        user_profile["interest"] = user_message

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *chat_history[-MAX_HISTORY:]
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    ai_reply = response.choices[0].message.content
    chat_history.append({"role": "assistant", "content": ai_reply})

    return jsonify({"reply": ai_reply})

if __name__ == "__main__":
    app.run()
