import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // On attend que React ait fini de monter pour effacer le logo
  window.requestAnimationFrame(() => {
    setTimeout(() => {
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 1000);
      }
    }, 500);
  });
}