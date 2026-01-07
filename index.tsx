import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 600);
  }
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // On cache le loader dès que le navigateur a fini le premier cycle de rendu
  requestAnimationFrame(() => {
    setTimeout(hideLoader, 200);
  });
} else {
  hideLoader();
}