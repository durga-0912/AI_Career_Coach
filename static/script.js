const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const micBtn = document.getElementById("micBtn");
const scanBtn = document.getElementById("scanBtn");
const video = document.getElementById("preview");

/* CHAT SEND */
function sendMessage() {
    const msg = userInput.value.trim();
    if (!msg) return;

    chatBox.innerHTML += `<div><b>You:</b> ${msg}</div>`;
    userInput.value = "";

    fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
    })
    .then(res => res.json())
    .then(data => {
        chatBox.innerHTML += `<div><b>AI:</b> ${data.reply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

/* 🎤 MIC (Speech to Text) */
micBtn.onclick = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech not supported");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
        userInput.value = event.results[0][0].transcript;
    };
};

/* 📷 SCANNER (Camera) */
scanBtn.onclick = async () => {
    try {
        alert("Allow camera access");

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });

        video.style.display = "block";
        video.srcObject = stream;
        await video.play();

    } catch (err) {
        alert("Camera error: " + err.message);
    }
};
