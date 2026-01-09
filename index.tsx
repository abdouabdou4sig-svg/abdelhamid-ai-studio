import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * ABDELHAMID ENGINE V3 - BOOT LOADER
 */

const mount = () => {
  const container = document.getElementById('root');
  const loader = document.getElementById('initial-loader');

  const hideLoader = () => {
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
  };

  if (!container) {
    console.error("Root container missing");
    hideLoader();
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // On cache le loader après un court délai pour assurer que le premier rendu est prêt
    setTimeout(hideLoader, 500);
  } catch (error) {
    console.error("React Mounting Error:", error);
    hideLoader();
  }
};

// Execution
mount();
