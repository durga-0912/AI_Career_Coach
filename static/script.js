const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const micBtn = document.getElementById("micBtn");

// Add message to chat
function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = sender === "user" ? "user-msg" : "bot-msg";
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message
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
    .then(data => {
        addMessage(data.reply, "bot");
    });
}

// 🎤 MIC – Speech to Text (STABLE VERSION)
if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    micBtn.onclick = () => {
        recognition.start();
        micBtn.innerText = "🎙️";
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        userInput.value = text;
        micBtn.innerText = "🎤";
    };

    recognition.onerror = () => {
        micBtn.innerText = "🎤";
        alert("Mic permission deny pannirukanga. Allow pannu.");
    };
} else {
    micBtn.onclick = () => {
        alert("Mic not supported in this browser. Use Chrome.");
    };
}
