const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

// Add message to UI
function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "msg " + sender;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (sender === "bot") speak(text);
}

// Send text message
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
        // Clean markdown symbols
        const cleanText = data.reply
            .replace(/\*\*/g, "")
            .replace(/###/g, "")
            .replace(/##/g, "")
            .replace(/\*/g, "");

        addMessage(cleanText, "bot");
    });
}

// 🎤 Voice input
function startMic() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = function(event) {
        userInput.value = event.results[0][0].transcript;
        sendMessage();
    };
}

// 🔊 Bot voice reply (Tamil + English)
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = /[அ-ஹ]/.test(text) ? "ta-IN" : "en-IN";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
}
