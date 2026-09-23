import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { tieneSuscripcionActiva } from '../../utils/suscripcion';
import SuscripcionDashboard from '../Dashboard/SuscripcionDashboard';
import './PagarSuscripcion.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Pantalla obligatoria: la cuenta no entra al panel hasta pagar su suscripción.
 * Se muestra justo después de registrarse y en cada login mientras no haya pago.
 */
export default function PagarSuscripcionPage() {
  const { token, user, logout, setSuscripcionActiva } = useAuthStore();
  const navigate = useNavigate();
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    // Si ya tiene suscripción vigente, no tiene nada que hacer aquí
    axios.get(`${API_URL}/tiendas`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (tieneSuscripcionActiva(res.data[0], user?.rol)) {
          setSuscripcionActiva(true);
          navigate('/dashboard', { replace: true });
        } else {
          setVerificado(true);
        }
      })
      .catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        } else {
          setVerificado(true);
        }
      });
  }, [token]);

  const cerrarSesion = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const irAlPanel = () => {
    setSuscripcionActiva(true);
    navigate('/dashboard', { replace: true });
  };

  if (!token || !verificado) return <div className="p-8 text-muted">Cargando...</div>;

  return (
    <div className="onboarding-wrapper">
      <header className="onboarding-topbar">
        <span className="onboarding-brand">micatalogo</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted onboarding-user">{user?.email}</span>
          <button className="btn btn-secondary" onClick={cerrarSesion}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="onboarding-content">
        <ol className="onboarding-steps mb-8">
          <li className="done">Cuenta creada</li>
          <li className="current">Pagar suscripción</li>
          <li>Configurar tu tienda</li>
        </ol>
        <SuscripcionDashboard modo="onboarding" onPagado={irAlPanel} />
      </main>
    </div>
  );
}
