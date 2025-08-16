// src/hooks/useSpeech.js
import { useState } from "react";
import { translateText } from "../services/api";

export function useSpeech(sourceLang = "en-US", targetLang = "es-ES") {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");

  let recognition;

  if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.lang = sourceLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);

      // ✅ Use selected languages, not hardcoded
      const translated = await translateText(
        spokenText,
        sourceLang.split("-")[0], // e.g. "en"
        targetLang.split("-")[0] // e.g. "ur"
      );

      if (translated) {
        setTranslation(translated);
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  }

  const startListening = () => {
    if (recognition) {
      setListening(true);
      recognition.start();
    } else {
      alert("Speech Recognition not supported in this browser");
    }
  };

  // 🔹 New: Speak function for original or translated text
  const handleSpeak = (text, lang) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) => v.lang === lang);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      utterance.lang = lang.split("-")[0]; // fallback (e.g., "ur")
    }

    window.speechSynthesis.speak(utterance);
  };

  return { listening, transcript, translation, startListening, handleSpeak };
}
