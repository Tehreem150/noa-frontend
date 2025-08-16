import React, { useRef, useState } from "react";
import { startRecognizer } from "../services/speech";
import { speak } from "../services/tts";
import { LANGS, findLang } from "../services/langs";
import axios from "axios";

export default function HealthcareTranslator() {
  const [inputLang, setInputLang] = useState("en");
  const [outputLang, setOutputLang] = useState("es");
  const [interimText, setInterimText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [translated, setTranslated] = useState("");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);
  const recRef = useRef(null);

  // ✅ Updated translate function to call live backend
  const translateNow = async (text) => {
    if (!text || !text.trim()) {
      setTranslated("");
      setShowTranslated(false);
      return;
    }
    try {
      setBusy(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/translate`, // Use Vercel backend
        {
          text,
          sourceLang: inputLang,
          targetLang: outputLang,
        }
      );
      setTranslated(res.data.translatedText || "");
      setShowTranslated(true);
    } catch (e) {
      console.error("translate error", e);
      setTranslated("Error: Could not translate. Check backend URL.");
      setShowTranslated(true);
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
      onError: (e) => {
        console.error("mic error", e);
        setListening(false);
      },
    });
    if (recRef.current) setListening(true);
  };

  const stop = () => {
    recRef.current?.stop();
    setListening(false);
    setInterimText("");
  };

  const clearAll = () => {
    setInterimText("");
    setFinalText("");
    setTranslated("");
    setShowTranslated(false);
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
            <label className="text-sm font-semibold text-gray-700">
              Input (Patient)
            </label>
            <select
              className="mt-1 w-full border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-teal-500"
              value={inputLang}
              onChange={(e) => setInputLang(e.target.value)}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Output (Provider)
            </label>
            <select
              className="mt-1 w-full border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-teal-500"
              value={outputLang}
              onChange={(e) => setOutputLang(e.target.value)}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {!listening ? (
            <button
              onClick={start}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-md transition"
            >
              🎙️ Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg shadow-md transition"
            >
              ⏹️ Stop
            </button>
          )}
          <button
            onClick={swapLangs}
            className="px-4 py-2 rounded-lg border shadow-sm hover:bg-gray-100 transition"
          >
            ↔️ Swap
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-lg border shadow-sm hover:bg-gray-100 transition"
          >
            🧹 Clear
          </button>
        </div>

        {/* Translated / Original block */}
        {!showTranslated ? (
          <div className="border rounded-2xl p-4 bg-gray-50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-teal-700">
                Original (Live)
              </div>
            </div>
            <div className="min-h-[6rem] whitespace-pre-wrap text-gray-800">
              {finalText} <span className="opacity-60">{interimText}</span>
            </div>
            {finalText && (
              <div className="mt-3">
                <button
                  onClick={() => speak(finalText, findLang(inputLang).tts)}
                  className="text-sm bg-teal-100 hover:bg-teal-200 px-3 py-1 rounded-lg transition"
                >
                  🔊 Speak Original
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="border rounded-2xl p-4 bg-gray-50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-teal-700">
                Translated
              </div>
              <div className="text-xs text-gray-500">
                {busy ? "Translating…" : ""}
              </div>
            </div>
            <div className="min-h-[6rem] whitespace-pre-wrap text-gray-800">
              {translated}
            </div>
            {translated && (
              <div className="mt-3">
                <button
                  onClick={() => speak(translated, findLang(outputLang).tts)}
                  className="text-sm bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-lg transition"
                >
                  🔊 Speak Translated
                </button>
              </div>
            )}
          </div>
        )}

        {/* Manual typing */}
        <textarea
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-teal-400 shadow-sm"
          rows={3}
          placeholder="Type here if mic not available…"
          value={finalText}
          onChange={(e) => setFinalText(e.target.value)}
        />
        <button
          onClick={() => translateNow(finalText)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg shadow-md transition"
        >
          🌐 Translate Typed Text
        </button>
      </div>
    </div>
  );
}
