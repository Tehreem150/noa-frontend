// frontend/pages/_app.js
import "../styles/app.css"; // import your CSS here

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
