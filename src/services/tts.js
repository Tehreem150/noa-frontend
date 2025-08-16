// src/services/tts.js
export function speak(text, lang = "en-US") {
  if (!text) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  window.speechSynthesis.cancel(); // stop ongoing speech
  window.speechSynthesis.speak(utter);
}
