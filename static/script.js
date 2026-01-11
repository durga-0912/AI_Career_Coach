const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const micBtn = document.getElementById("micBtn");

// add message
function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = sender === "user" ? "message user" : "message bot";
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// send message
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

// 🎤 MIC (FINAL STABLE VERSION)
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
        userInput.value = event.results[0][0].transcript;
        micBtn.innerText = "🎤";
    };

    recognition.onerror = () => {
        micBtn.innerText = "🎤";
        alert("Mic permission allow pannu (browser top-la)");
    };
} else {
    micBtn.onclick = () => {
        alert("Mic support illa. Chrome / Edge use pannu.");
    };
}
