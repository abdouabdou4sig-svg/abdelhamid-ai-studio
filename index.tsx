import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * ABDELHAMID AI ALCHEMY - BOOT LOADER PRO
 */

const mount = () => {
  const container = document.getElementById('root');
  const loader = document.getElementById('initial-loader');

  const hideLoader = () => {
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 800);
    }
  };

  if (!container) {
    console.error("ERREUR CRITIQUE: Conteneur #root introuvable.");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // On cache le loader après confirmation du rendu
    requestAnimationFrame(() => {
      setTimeout(hideLoader, 1000);
    });
  } catch (error) {
    console.error("ERREUR D'INVOCATION REACT:", error);
    // En cas d'erreur fatale, on affiche au moins un message
    if (container) {
      container.innerHTML = `<div style="padding: 40px; color: #D4AF37; font-family: serif; text-align: center;">
        <h1 style="font-size: 24px;">L'invocation a échoué</h1>
        <p style="color: white; opacity: 0.7;">Erreur lors de l'initialisation du moteur alchimique.</p>
        <pre style="text-align: left; background: #111; padding: 20px; border-radius: 10px; color: #ff5555; font-size: 12px; margin-top: 20px;">${error}</pre>
      </div>`;
    }
    hideLoader();
  }
};

mount();