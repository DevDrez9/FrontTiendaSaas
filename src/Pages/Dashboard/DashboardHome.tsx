import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { ExternalLink, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import './Dashboard.css';

export default function DashboardHome() {
  const { token, user } = useAuthStore();
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStoreData(res.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [token]);

  if (loading) return <div className="p-8 text-muted">Cargando tu panel...</div>;

  if (!storeData) return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Bienvenido, {user?.nombre}</h1>
      <p className="text-muted">No tienes ninguna tienda registrada. Contacta con el administrador.</p>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel General</h1>
          <p className="text-muted">Bienvenido al resumen de {storeData.nombre}</p>
        </div>
        <a 
          href={`/${storeData.dominio}`} 
          target="_blank" 
          rel="noreferrer"
          className="btn btn-primary shadow-sm"
        >
          <ExternalLink size={20} />
          Ver mi Tienda Virtual
        </a>
      </div>

      <div className="dashboard-stats-grid mb-8">
        <div className="card p-6 flex items-center gap-4">
          <div className="icon-circle bg-primary-light">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Plan Actual</p>
            <p className="text-xl font-bold">{storeData.plan?.nombre || 'Sin Plan'}</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center gap-4">
          <div className="icon-circle bg-success-light">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Estado</p>
            <p className="text-xl font-bold mb-1">
              {storeData.activa ? (
                <span className="text-success">Activa</span>
              ) : (
                <span className="text-danger">Inactiva / Suspendida</span>
              )}
            </p>
            {storeData.suscripcionFin && (
              <p className="text-xs text-muted">
                Vence: {new Date(storeData.suscripcionFin).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="icon-circle bg-secondary-light">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted">Dominio Público</p>
            <p className="text-lg font-bold">/{storeData.dominio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
