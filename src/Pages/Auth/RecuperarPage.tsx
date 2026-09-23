import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const mensajeError = (err: any, fallback: string) => {
  const m = err?.response?.data?.message;
  return Array.isArray(m) ? m[0] : m || fallback;
};

export default function RecuperarPage() {
  const [paso, setPaso] = useState<'email' | 'codigo'>('email');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const enviarCodigo = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setInfo(res.data?.message || 'Te enviamos un código a tu correo.');
      setPaso('codigo');
    } catch (err) {
      setError(mensajeError(err, 'No se pudo enviar el código'));
    } finally {
      setLoading(false);
    }
  };

  const cambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { email, codigo, password });
      navigate('/login', { replace: true, state: { mensaje: 'Contraseña actualizada. Inicia sesión.' } });
    } catch (err) {
      setError(mensajeError(err, 'No se pudo cambiar la contraseña'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg-shape1"></div>
      <div className="auth-bg-shape2"></div>

      <div className="auth-left">
        <h1 className="text-4xl mb-4 text-center">¿Olvidaste tu contraseña?</h1>
        <p className="text-lg text-center" style={{ opacity: 0.9, maxWidth: '400px' }}>
          Te enviaremos un código a tu correo para que crees una nueva.
        </p>
      </div>

      <div className="auth-right">
        <div className="glass-panel auth-glass-container animate-slide-up">
          <div className="mb-6">
            <h2 className="auth-title">{paso === 'email' ? 'Recuperar acceso' : 'Ingresa el código'}</h2>
            <p className="auth-subtitle">
              {paso === 'email'
                ? 'Escribe el correo con el que te registraste'
                : <>Enviamos un código de 6 dígitos a <strong>{email}</strong>. Revisa también tu carpeta de spam.</>}
            </p>
          </div>

          {error && <div className="error-message animate-fade-in">{error}</div>}
          {info && paso === 'codigo' && !error && <div className="success-message animate-fade-in">{info}</div>}

          {paso === 'email' ? (
            <form onSubmit={enviarCodigo} className="flex flex-col gap-4">
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
              <button type="submit" disabled={loading} className="btn btn-primary w-full mt-4">
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
            </form>
          ) : (
            <form onSubmit={cambiarPassword} className="flex flex-col gap-4">
              <div className="form-group m-0">
                <label className="form-label">Código</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  pattern="\d{6}"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                  className="form-input codigo-input"
                  placeholder="000000"
                />
              </div>
              <div className="form-group m-0">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>
              <div className="form-group m-0">
                <label className="form-label">Repite la contraseña</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full mt-4">
                {loading ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
              <button type="button" disabled={loading} className="btn btn-secondary w-full" onClick={() => enviarCodigo()}>
                Reenviar código
              </button>
            </form>
          )}

          <div className="auth-footer">
            <Link to="/login" className="auth-link">Volver a iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
