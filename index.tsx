import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Retrait progressif du loader
    const loader = document.getElementById('initial-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 800);
    }
  } catch (error) {
    console.error("Erreur de montage React:", error);
    // En cas d'erreur, on retire quand même le loader pour voir les erreurs console
    const loader = document.getElementById('initial-loader');
    if (loader) loader.remove();
  }
}