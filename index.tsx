import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO PRO - CORE REBOOT
 */

const startApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Signaler au document que l'application est prête
    if (typeof (window as any).wakeUp === 'function') {
      (window as any).wakeUp();
    }
  } catch (err) {
    console.error("Erreur critique au démarrage:", err);
    // En cas d'erreur fatale, on libère quand même le loader pour debug
    if (typeof (window as any).wakeUp === 'function') {
      (window as any).wakeUp();
    }
  }
};

// Démarrage dès que possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}