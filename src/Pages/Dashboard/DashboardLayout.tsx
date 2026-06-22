import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Package, Settings, LayoutDashboard, Shield, ShoppingCart, Tags } from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      // Fetch store to check plan level
      axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setStoreData(res.data[0]);
      }).catch(err => console.error(err));
    }
  }, [token, navigate]);

  if (!token) return null;

  const showCategories = storeData && storeData.plan && storeData.plan.nivel >= 2;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Panel SaaS</h2>
          <p>Hola, {user?.nombre}</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
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
            onClick={() => logout()}
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
           <button onClick={() => logout()} className="btn-text">Salir</button>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
