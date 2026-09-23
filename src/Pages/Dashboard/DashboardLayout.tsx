import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Package, Settings, LayoutDashboard, Shield, ShoppingCart, Tags, Menu, X } from 'lucide-react';
import './DashboardLayout.css';
import { tieneSuscripcionActiva } from '../../utils/suscripcion';

export default function DashboardLayout() {
  const { token, user, logout, setSuscripcionActiva } = useAuthStore();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      // Fetch store to check plan level
      axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const tienda = res.data[0];
        // Se revisa contra el servidor en cada carga del panel (no solo al loguear),
        // así también se bloquea si la suscripción venció con la sesión abierta.
        const activa = tieneSuscripcionActiva(tienda, user?.rol);
        setSuscripcionActiva(activa);
        if (!activa) {
          navigate('/pagar-suscripcion', { replace: true });
          return;
        }
        setStoreData(tienda);
      }).catch(err => {
        console.error(err);
        if (err.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        }
      });
    }
  }, [token, navigate]);

  if (!token) return null;
  // No mostrar el panel hasta confirmar la suscripción (evita que se vea un instante)
  if (!storeData && user?.rol !== 'ADMIN') return <div className="p-8 text-muted">Cargando...</div>;

  const showCategories = storeData && storeData.plan && storeData.plan.nivel >= 2;

  return (
    <div className="dashboard-container">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header flex justify-between items-center">
          <div>
            <h2>Panel SaaS</h2>
            <p>Hola, {user?.nombre}</p>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item" onClick={() => setIsMobileMenuOpen(false)}>
            <LayoutDashboard size={20} />
            Inicio
          </Link>
          <Link to="/dashboard/productos" className="nav-item">
            <Package size={20} />
            Catálogo
          </Link>
          {showCategories && (
            <Link to="/dashboard/categorias" className="nav-item">
              <Tags size={20} />
              Categorías
            </Link>
          )}
          <Link to="/dashboard/pedidos" className="nav-item">
            <ShoppingCart size={20} />
            Pedidos
          </Link>
          <Link to="/dashboard/suscripcion" className="nav-item">
            <Tags size={20} />
            Mi Suscripción
          </Link>
          <Link to="/dashboard/configuracion" className="nav-item">
            <Settings size={20} />
            Configuración
          </Link>
          
          {user?.rol === 'ADMIN' && (
            <Link to="/dashboard/admin" className="nav-item">
              <Shield size={20} />
              Admin Global
            </Link>
          )}

          <button 
            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
            className="nav-item logout"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
           <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
             <Menu size={24} />
           </button>
           <button onClick={() => logout()} className="btn-text">Salir</button>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
