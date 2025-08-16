// src/services/speech.js
export function startRecognizer({ lang = "en-US", onPartial, onFinal, onError }) {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech Recognition not supported in this browser.");
    return null;
  }

  const rec = new window.webkitSpeechRecognition();
  rec.lang = lang;
  rec.continuous = true;
  rec.interimResults = true;

  rec.onresult = (event) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }
    if (interim && onPartial) onPartial(interim);
    if (final && onFinal) onFinal(final);
  };

  rec.onerror = (e) => {
    console.error("Recognizer error", e);
    if (onError) onError(e);
  };

  rec.start();
  return rec;
}
