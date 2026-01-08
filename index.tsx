import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO PRO - BOOTLOADER SÉCURISÉ
 */

const mountApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Déclenche la disparition du loader du HTML
    if (typeof (window as any).releaseStudio === 'function') {
      setTimeout(() => (window as any).releaseStudio(), 200);
    }
  } catch (error) {
    console.error("Erreur critique au démarrage de l'App:", error);
    // On libère quand même l'écran pour voir l'erreur dans la console si besoin
    if (typeof (window as any).releaseStudio === 'function') {
      (window as any).releaseStudio();
    }
  }
};

// Lancement propre
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}