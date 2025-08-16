// src/services/langs.js

export const LANGS = [
  { code: "en", label: "English", tts: "en-US" },
  { code: "es", label: "Spanish", tts: "es-ES" },
  { code: "fr", label: "French", tts: "fr-FR" },
  { code: "de", label: "German", tts: "de-DE" },
  { code: "it", label: "Italian", tts: "it-IT" },
  { code: "pt", label: "Portuguese", tts: "pt-PT" },
  { code: "ru", label: "Russian", tts: "ru-RU" },
  { code: "zh", label: "Chinese (Mandarin)", tts: "zh-CN" },
  { code: "ja", label: "Japanese", tts: "ja-JP" },
  { code: "ko", label: "Korean", tts: "ko-KR" },
  { code: "hi", label: "Hindi", tts: "hi-IN" },
  { code: "ur", label: "Urdu", tts: "ur-PK" },
  { code: "ar", label: "Arabic", tts: "ar-SA" },
  { code: "tr", label: "Turkish", tts: "tr-TR" },
  { code: "fa", label: "Persian (Farsi)", tts: "fa-IR" },
  { code: "bn", label: "Bengali", tts: "bn-BD" },
  { code: "ta", label: "Tamil", tts: "ta-IN" },
  { code: "te", label: "Telugu", tts: "te-IN" },
  { code: "pa", label: "Punjabi", tts: "pa-IN" },
  { code: "gu", label: "Gujarati", tts: "gu-IN" },
  { code: "mr", label: "Marathi", tts: "mr-IN" },
];

export const findLang = (code) => LANGS.find((l) => l.code === code);
