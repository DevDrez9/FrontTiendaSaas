import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { Trash2 } from 'lucide-react';
import './Dashboard.css';

export default function CategoriasDashboard() {
  const { token } = useAuthStore();
  const [storeData, setStoreData] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevaCategoria, setNuevaCategoria] = useState('');

  const fetchData = async () => {
    try {
      const resStores = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const miTienda = resStores.data[0];
      setStoreData(miTienda);

      if (miTienda) {
        const resCat = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categoria/tienda/${miTienda.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategorias(resCat.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaCategoria.trim()) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categoria`, {
        nombre: nuevaCategoria,
        tiendaId: storeData.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNuevaCategoria('');
      fetchData();
    } catch (error) {
      alert('Error al crear categoría');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categoria/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert('Error al eliminar categoría. Verifica que no tenga productos asociados.');
    }
  };

  if (loading) return <div className="p-8 text-muted">Cargando categorías...</div>;
  
  if (!storeData || (storeData.plan?.nivel || 0) < 5) {
    return (
      <div className="p-8">
        <div className="warning-card">
          <h2 className="text-xl font-bold mb-2">Función no disponible</h2>
          <p>Las categorías personalizadas solo están disponibles en planes Avanzados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="card p-6 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Administrar Categorías</h2>
        
        <form onSubmit={handleCreate} className="flex gap-4 mb-8">
          <input 
            type="text" 
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            placeholder="Nombre de la nueva categoría"
            className="form-input flex-1"
            required
          />
          <button type="submit" className="btn btn-primary w-auto">
            Añadir Categoría
          </button>
        </form>

        {categorias.length === 0 ? (
          <div className="empty-state">Aún no tienes categorías.</div>
        ) : (
          <ul className="list-group">
            {categorias.map(cat => (
              <li key={cat.id} className="list-item">
                <span className="font-medium">{cat.nombre}</span>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="btn btn-danger w-auto"
                  title="Eliminar categoría"
                  style={{ padding: '0.5rem' }}
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
