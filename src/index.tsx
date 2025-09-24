import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Polyfill for persistentStorage (for production)
if (!window.persistentStorage) {
  window.persistentStorage = {
    setItem: async (key: string, value: string) => {
      localStorage.setItem(key, value);
    },
    getItem: async (key: string) => {
      return localStorage.getItem(key);
    },
    removeItem: async (key: string) => {
      localStorage.removeItem(key);
    },
    clear: async () => {
      localStorage.clear();
    }
  };
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
