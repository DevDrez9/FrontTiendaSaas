import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import './Auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mensaje = (location.state as any)?.mensaje as string | undefined;
  const setAuth = useAuthStore(state => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`, {
        email,
        password,
      });

      const { access_token, user, suscripcionActiva } = response.data;
      setAuth(access_token, user, !!suscripcionActiva);

      // Sin suscripción pagada no se entra al panel
      navigate(suscripcionActiva ? '/dashboard' : '/pagar-suscripcion', { replace: true });
    } catch (err: any) {
      const m = err.response?.data?.message;
      setError((Array.isArray(m) ? m[0] : m) || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg-shape1"></div>
      <div className="auth-bg-shape2"></div>

      <div className="auth-left">
        <h1 className="text-4xl mb-4 text-center">Bienvenido de nuevo</h1>
        <p className="text-lg text-center" style={{ opacity: 0.9, maxWidth: '400px' }}>
          Accede a tu panel de control y gestiona tu tienda de forma rápida y sencilla.
        </p>
      </div>

      <div className="auth-right">
        <div className="glass-panel auth-glass-container animate-slide-up">
          <div className="mb-6">
            <h2 className="auth-title">Inicia Sesión</h2>
            <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {error && <div className="error-message animate-fade-in">{error}</div>}
            {mensaje && !error && <div className="success-message animate-fade-in">{mensaje}</div>}
            
            <div className="form-group m-0">
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="form-group m-0">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
              />
            </div>
            <Link to="/recuperar" className="auth-link auth-forgot">¿Olvidaste tu contraseña?</Link>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-4">
              {loading ? 'Cargando...' : 'Entrar'}
            </button>
          </form>

          <div className="auth-footer">
            ¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
