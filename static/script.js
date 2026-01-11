let voiceOn = true;
const synth = window.speechSynthesis;

function addMsg(text, cls) {
  const div = document.createElement("div");
  div.className = "msg " + cls;
  div.innerText = text;
  document.getElementById("chatBox").appendChild(div);
  div.scrollIntoView();
}

function sendMessage() {
  const input = document.getElementById("userInput");
  if (!input.value) return;

  addMsg(input.value, "user");

  fetch("/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message: input.value})
  })
  .then(res => res.json())
  .then(data => {
    addMsg(data.reply, "bot");
    speak(data.reply);
  });

  input.value = "";
}

function startMic() {
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang = "ta-IN";   // Tamil mic
  rec.start();
  rec.onresult = e => {
    document.getElementById("userInput").value = e.results[0][0].transcript;
    sendMessage();
  };
}

function speak(text) {
  if (!voiceOn) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "ta-IN";   // Tamil voice
  synth.speak(msg);
}

function toggleVoice() {
  voiceOn = !voiceOn;
}
