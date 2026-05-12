import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./app/App.tsx";
import "./styles/index.css";
import { initMetaPixel } from "./app/lib/metaPixel";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id-here.apps.googleusercontent.com";
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || 'YOUR_PIXEL_ID';

// Initialize Meta Pixel for conversion tracking
initMetaPixel(META_PIXEL_ID);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);