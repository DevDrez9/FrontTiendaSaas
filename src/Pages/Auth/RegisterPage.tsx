import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import './Auth.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/register`, {
        email,
        password,
        nombre
      });

      const { access_token, user } = response.data;
      setAuth(access_token, user);
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg-shape1"></div>
      <div className="auth-bg-shape2"></div>

      <div className="auth-left">
        <h1 className="text-4xl mb-4 text-center">Únete a micatalogo</h1>
        <p className="text-lg text-center" style={{ opacity: 0.9, maxWidth: '400px' }}>
          Crea tu tienda en línea en minutos y comienza a vender a todo el mundo de inmediato.
        </p>
      </div>

      <div className="auth-right">
        <div className="glass-panel auth-glass-container animate-slide-up">
          <div className="mb-6">
            <h2 className="auth-title">Crea tu cuenta</h2>
            <p className="auth-subtitle">Completa tus datos para empezar</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {error && <div className="error-message animate-fade-in">{error}</div>}
            
            <div className="form-group m-0">
              <label className="form-label">Nombre de tu Comercio o Responsable</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-input"
                placeholder="Mi Super Tienda"
              />
            </div>

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
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-4">
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <div className="auth-footer">
            ¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
