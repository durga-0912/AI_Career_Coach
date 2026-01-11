const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = sender === "user" ? "user-msg" : "bot-msg";
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const msg = userInput.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    userInput.value = "";

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
    })
    .then(res => res.json())
    .then(data => addMessage(data.reply, "bot"));
}

/* 🎤 MIC */
function startMic() {
    if (!("webkitSpeechRecognition" in window)) {
        alert("Mic works only in Chrome browser");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        userInput.value = text;
        sendMessage();
    };

    recognition.start();
}
