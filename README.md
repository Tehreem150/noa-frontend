# Healthcare Translator - Frontend Starter

## Quick start
1. Ensure Node >= 20.19.0 (recommended).
2. In the `frontend/` folder install deps: `npm install`.
3. Start dev server: `npm run dev`.

The frontend expects a translation backend at `http://localhost:4000/api/translate`.

## Notes
- The starter uses the Web Speech API for recognition and the browser SpeechSynthesis for TTS.
- Update the translation endpoint in `src/components/HealthcareTranslator.jsx` to match your backend deployment.