/**
 * storage.js
 * Helpers for LocalStorage
 */

export const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Error reading from localStorage', e);
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Error saving to localStorage', e);
    }
  }
};
