import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios'
import { useAuthStore } from './store/authStore'

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // En /auth/* un 401 es "credenciales inválidas": lo muestra el formulario, no se redirige
    const esAuth = String(error.config?.url || '').includes('/auth/');
    if (error.response?.status === 401 && !esAuth) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    // El backend exige suscripción vigente: si venció o no se pagó, a la pantalla de pago
    if (
      error.response?.status === 403 &&
      error.response?.data?.code === 'SUSCRIPCION_REQUERIDA' &&
      window.location.pathname !== '/pagar-suscripcion'
    ) {
      useAuthStore.getState().setSuscripcionActiva(false);
      window.location.href = '/pagar-suscripcion';
    }
    return Promise.reject(error);
  }
);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
