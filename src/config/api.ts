import axios from 'axios';

// Usamos la variable de entorno de Vite o por defecto localhost en desarrollo
const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}`;

export const api = axios.create({
  baseURL: API_URL,
});

export const getApiUrl = () => API_URL;

export const fixImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://localhost:3000')) {
    return url.replace('http://localhost:3000', API_URL);
  }
  if (url.startsWith('/uploads')) {
    return `${API_URL}${url}`;
  }
  return url;
};
