const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const micBtn = document.getElementById("micBtn");

// SEND MESSAGE
function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    userInput.value = "";

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
    })
    .then(res => res.json())
    .then(data => {
        addMessage(data.reply, "bot");
    });
}

// ADD MESSAGE TO CHAT
function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = sender === "user" ? "user-msg" : "bot-msg";
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 🎤 SPEECH TO TEXT (MIC)
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";
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
        alert("Mic error / permission denied");
    };
} else {
    micBtn.onclick = () => {
        alert("Speech Recognition not supported in this browser");
    };
}
