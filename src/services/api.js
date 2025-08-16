// src/services/api.js
export async function translateText(text, sourceLang = "en", targetLang = "es") {
  try {
    const response = await fetch("http://localhost:5000/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang }),
    });

    if (!response.ok) throw new Error("Translation API failed");
    const data = await response.json();
    return data.translatedText;
  } catch (err) {
    console.error("API error:", err);
    return null;
  }
}
