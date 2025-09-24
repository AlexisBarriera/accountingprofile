import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// CRITICAL: Define persistentStorage BEFORE any component loads
declare global {
  interface Window {
    persistentStorage: {
      setItem(key: string, value: string): Promise<void>;
      getItem(key: string): Promise<string | null>;
      removeItem(key: string): Promise<void>;
      clear(): Promise<void>;
    };
  }
}

// Create the polyfill
window.persistentStorage = {
  setItem: async (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  },
  getItem: async (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove from localStorage:', e);
    }
  },
  clear: async () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  }
};

// Now render the app
const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
