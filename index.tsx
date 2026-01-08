import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * ABDELHAMID ENGINE V3 - RECOVERY BOOT
 */

const container = document.getElementById('root');
const loader = document.getElementById('initial-loader');

const removeLoader = () => {
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }
};

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // On retire le loader rapidement pour laisser React s'afficher
    setTimeout(removeLoader, 800);
  } catch (err) {
    console.error("Critical rendering error:", err);
    removeLoader();
  }
} else {
  console.error("Root container not found");
}