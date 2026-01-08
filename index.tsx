import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO PRO - MASTER BOOTLOADER
 */

const init = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Notification de succès au système de loader du HTML
    if (typeof (window as any).releaseStudio === 'function') {
      // On laisse un micro-délai pour que le premier render soit fluide
      setTimeout((window as any).releaseStudio, 100);
    }
  } catch (error) {
    console.error("Échec critique du montage React:", error);
    if (typeof (window as any).releaseStudio === 'function') {
      (window as any).releaseStudio();
    }
  }
};

// Exécution immédiate
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}