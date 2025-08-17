/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // Next.js pages
    "./components/**/*.{js,ts,jsx,tsx}", // Your components
    "./src/**/*.{js,ts,jsx,tsx}", // optional, if you have src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
