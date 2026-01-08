import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

const removeLoader = () => {
  const loader = document.getElementById('initial-loader');
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
    // On retire le loader dès que React a commencé le rendu
    setTimeout(removeLoader, 1000);
  } catch (error) {
    console.error("Erreur de lancement Abdelhamid Engine:", error);
    removeLoader();
    container.innerHTML = `
      <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #050505; color: white; font-family: sans-serif;">
        <h1 style="color: #e11d48;">Erreur de chargement</h1>
        <p style="opacity: 0.6;">L'application n'a pas pu démarrer.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #e11d48; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;">Réessayer</button>
      </div>
    `;
  }
} else {
  console.error("Élément #root introuvable");
  removeLoader();
}