import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO PRO - CORE ENTRY
 * Robust mounting with error handling
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

    // Signale au HTML de retirer le loader
    if (typeof (window as any).releaseStudio === 'function') {
      setTimeout(() => (window as any).releaseStudio(), 100);
    }
  } catch (err) {
    console.error("Erreur critique au montage React:", err);
    if (typeof (window as any).releaseStudio === 'function') {
      (window as any).releaseStudio();
    }
  }
};

// Initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}