import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import './Dashboard.css';

export default function PedidosDashboard() {
  const { token } = useAuthStore();
  const [storeData, setStoreData] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStores = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const miTienda = resStores.data[0];
        setStoreData(miTienda);

        if (miTienda) {
          const resVentas = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/venta/tienda/${miTienda.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Assuming backend returns an array of ventas directly or inside data
          setPedidos(resVentas.data.data || resVentas.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const updateEstado = async (id: number, nuevoEstado: string) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/venta/${id}/estado`, 
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Actualizar localmente
      setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
    } catch(err) {
      alert('Error al actualizar el estado del pedido');
    }
  };

  if (loading) return <div className="p-8 text-muted">Cargando pedidos...</div>;
  if (!storeData) return <div className="p-8 text-muted">No se encontró la tienda.</div>;

  const estados = ['PENDIENTE', 'CONFIRMADA', 'EN_PROCESO', 'ENVIADA', 'ENTREGADA', 'CANCELADA'];

  return (
    <div className="p-8">
      <div className="card">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Pedidos Recibidos</h2>
          <p className="text-muted">Gestiona los pedidos de tus clientes</p>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nº Venta</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="font-medium">{pedido.numeroVenta}</td>
                  <td>
                    <div className="font-medium">{pedido.cliente}</div>
                    <div className="text-sm text-muted">{pedido.telefono}</div>
                    <div className="text-sm text-muted">{pedido.direccion}</div>
                  </td>
                  <td>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                  <td className="font-bold text-primary">${pedido.total}</td>
                  <td>
                    <select 
                      value={pedido.estado} 
                      onChange={(e) => updateEstado(pedido.id, e.target.value)}
                      className="form-input"
                      style={{ padding: '0.25rem 0.5rem', width: 'auto' }}
                    >
                      {estados.map(est => (
                        <option key={est} value={est}>{est}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted p-8">No hay pedidos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
