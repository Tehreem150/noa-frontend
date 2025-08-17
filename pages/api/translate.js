import Cors from "cors";
import OpenAI from "openai";

// CORS setup
const cors = Cors({ methods: ["POST", "OPTIONS"], origin: "*" });
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) =>
      result instanceof Error ? reject(result) : resolve(result)
    );
  });
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, sourceLang = "en", targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Keep medical terms accurate:\n\n"${text}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const translatedText = completion.choices[0].message.content.trim();
    res.status(200).json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error.message);
    res.status(500).json({ error: "Translation failed" });
  }
}
