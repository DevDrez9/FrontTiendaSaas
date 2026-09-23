import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  nombre: string;
  rol: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  suscripcionActiva: boolean;
  setAuth: (token: string, user: User, suscripcionActiva?: boolean) => void;
  setSuscripcionActiva: (activa: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      suscripcionActiva: false,
      setAuth: (token, user, suscripcionActiva = false) => set({ token, user, suscripcionActiva }),
      setSuscripcionActiva: (suscripcionActiva) => set({ suscripcionActiva }),
      logout: () => set({ token: null, user: null, suscripcionActiva: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
