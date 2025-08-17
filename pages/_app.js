// frontend/pages/_app.js
import "../styles/globals.css"; // import your CSS here

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
