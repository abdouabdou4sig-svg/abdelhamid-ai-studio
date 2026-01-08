import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID ENGINE BOOTSTRAP
 * Ce script initialise l'application et gère le retrait du loader.
 */

const mountApp = () => {
  const container = document.getElementById('root');
  const loader = document.getElementById('initial-loader');

  const removeLoader = () => {
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 800);
    }
  };

  if (!container) {
    console.error("CRITICAL: Root container not found");
    removeLoader();
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Succès du rendu initial : on attend un peu pour laisser les images charger
    setTimeout(removeLoader, 1500);
  } catch (error) {
    console.error("ENGINE BOOT ERROR:", error);
    // On retire le loader quand même pour ne pas laisser l'utilisateur sur un écran bloqué
    removeLoader();
    
    // Affichage d'un message d'erreur minimaliste à l'écran
    container.innerHTML = `
      <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; color: #e11d48; font-family: sans-serif; padding: 20px; text-align: center;">
        <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 10px;">ENGINE ERROR</h1>
        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Une erreur fatale est survenue lors du démarrage du moteur.</p>
        <button onclick="window.location.reload()" style="background: #e11d48; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer;">RECHARGER LE SYSTÈME</button>
      </div>
    `;
  }
};

// Lancement immédiat
mountApp();
