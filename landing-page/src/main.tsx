import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initMetaPixel } from './lib/metaPixel'

// Initialize Meta Pixel for conversion tracking
// Replace with your actual pixel ID
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || 'YOUR_PIXEL_ID';
initMetaPixel(PIXEL_ID);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
