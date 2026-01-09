import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const initAlchemy = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Retrait propre du loader quand React est prêt
    requestAnimationFrame(() => {
      setTimeout(() => {
        const loader = document.getElementById('initial-loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => loader.remove(), 1000);
        }
      }, 1000);
    });
  } catch (error) {
    console.error("Mounting Error:", error);
    const loader = document.getElementById('initial-loader');
    if (loader) loader.remove();
  }
};

initAlchemy();