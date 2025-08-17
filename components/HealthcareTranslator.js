import React, { useRef, useState, useEffect } from "react";
import { startRecognizer } from "../src/services/speech"; // Web Speech API wrapper
import { speak } from "../src/services/tts"; // Text-to-Speech
import { LANGS, findLang } from "../src/services/langs";
import axios from "axios";

export default function HealthcareTranslator() {
  const [inputLang, setInputLang] = useState("en");
  const [outputLang, setOutputLang] = useState("es");
  const [interimText, setInterimText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [translated, setTranslated] = useState("");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const recRef = useRef(null);

  // Auto-translate as user speaks
  useEffect(() => {
    if (finalText.trim()) translateNow(finalText);
  }, [finalText, inputLang, outputLang]);

  const translateNow = async (text) => {
    if (!text.trim()) {
      setTranslated("");
      return;
    }
    try {
      setBusy(true);
      const res = await axios.post("/api/translate", {
        text,
        sourceLang: inputLang,
        targetLang: outputLang,
      });
      setTranslated(res.data.translatedText || "No translation available");
    } catch (e) {
      console.error("translate error", e);
      setTranslated("Error: Could not translate.");
    } finally {
      setBusy(false);
    }
  };

  const start = () => {
    if (listening) return;
    setInterimText("");
    recRef.current = startRecognizer({
      lang: findLang(inputLang).tts,
      onPartial: setInterimText,
      onFinal: (f) => setFinalText((prev) => (prev + " " + f).trim()),
      onError: (e) => console.error("Mic error:", e),
    });
    if (recRef.current) setListening(true);
  };

  const stop = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const clearAll = () => {
    setInterimText("");
    setFinalText("");
    setTranslated("");
  };

  const swapLangs = () => {
    setInputLang(outputLang);
    setOutputLang(inputLang);
    clearAll();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-start justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-center text-teal-700">
          🏥 Healthcare Translation (Realtime)
        </h1>

        {/* Language selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Input (Patient)</label>
            <select
              className="mt-1 w-full border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-teal-500"
              value={inputLang}
              onChange={(e) => setInputLang(e.target.value)}
            >
              {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Output (Provider)</label>
            <select
              className="mt-1 w-full border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-teal-500"
              value={outputLang}
              onChange={(e) => setOutputLang(e.target.value)}
            >
              {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={listening ? stop : start}
            className={`flex-1 py-2 rounded-lg shadow-md text-white ${listening ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {listening ? "⏹️ Stop" : "🎙️ Start"}
          </button>
          <button onClick={swapLangs} className="px-4 py-2 rounded-lg border shadow-sm hover:bg-gray-100">↔️ Swap</button>
          <button onClick={clearAll} className="px-4 py-2 rounded-lg border shadow-sm hover:bg-gray-100">🧹 Clear</button>
        </div>

        {/* Transcripts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-2xl p-4 bg-gray-50 shadow-sm">
            <div className="text-sm font-semibold text-teal-700 mb-2">Original (Live)</div>
            <div className="min-h-[6rem] whitespace-pre-wrap text-gray-800">{finalText} <span className="opacity-60">{interimText}</span></div>
            {finalText && <button onClick={() => speak(finalText, findLang(inputLang).tts)} className="text-sm bg-teal-100 hover:bg-teal-200 px-3 py-1 rounded-lg mt-2">🔊 Speak Original</button>}
          </div>
          <div className="border rounded-2xl p-4 bg-gray-50 shadow-sm">
            <div className="flex justify-between mb-2">
              <div className="text-sm font-semibold text-teal-700">Translated</div>
              {busy && <div className="text-xs text-gray-500">Translating…</div>}
            </div>
            <div className="min-h-[6rem] whitespace-pre-wrap text-gray-800">{translated}</div>
            {translated && <button onClick={() => speak(translated, findLang(outputLang).tts)} className="text-sm bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-lg mt-2">🔊 Speak Translated</button>}
          </div>
        </div>

        {/* Manual typing */}
        <textarea
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-400 shadow-sm mt-2"
          rows={3}
          placeholder="Type here if mic not available…"
          value={finalText}
          onChange={(e) => setFinalText(e.target.value)}
        />
        <button onClick={() => translateNow(finalText)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg shadow-md mt-2">🌐 Translate Typed Text</button>
      </div>
    </div>
  );
}
