import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import './Dashboard.css';

export default function AdminPanel() {
  const { token, user } = useAuthStore();
  const [tiendas, setTiendas] = useState<any[]>([]);
  const [planes, setPlanes] = useState<any[]>([{ id: null, nombre: 'Sin Plan' }]);
  const [loading, setLoading] = useState(true);

  const fetchTiendasAndPlanes = async () => {
    try {
      const [resTiendas, resPlanes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas/admin/all`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/planes`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTiendas(resTiendas.data);
      setPlanes([{ id: null, nombre: 'Sin Plan' }, ...resPlanes.data]);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.rol === 'ADMIN') {
      fetchTiendasAndPlanes();
    }
  }, [user]);

  const handleUpdatePlan = async (tiendaId: number, newPlanId: number | null, isRenovation: boolean = false) => {
    let payload: any = { planId: newPlanId === 0 ? null : newPlanId };
    
    if (newPlanId !== 0 && newPlanId !== null && isRenovation) {
      const mesesStr = prompt('¿Cuántos meses de suscripción deseas asignar/renovar?');
      if (!mesesStr) return;
      const meses = parseInt(mesesStr);
      if (isNaN(meses) || meses <= 0) {
        alert('Cantidad de meses inválida');
        return;
      }
      payload.meses = meses;
    }

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas/admin/${tiendaId}/plan`, 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTiendasAndPlanes(); // Refetch
      alert('Plan y suscripción actualizados correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar plan');
    }
  };

  const handleDelete = async (tiendaId: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta tienda?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas/${tiendaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTiendasAndPlanes();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar tienda');
    }
  };

  if (user?.rol !== 'ADMIN') return <div className="p-8 text-danger">Acceso Denegado</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración Global</h1>
          <p className="text-muted">Gestiona todas las tiendas registradas y sus suscripciones.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Cargando tiendas...</p>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Dominio</th>
                  <th>Plan Actual</th>
                  <th>Vigencia</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tiendas.map((tienda) => (
                  <tr key={tienda.id}>
                    <td>{tienda.id}</td>
                    <td className="font-semibold">{tienda.nombre}</td>
                    <td>{tienda.dominio}</td>
                    <td>
                      <select 
                        className="form-input"
                        style={{ padding: '0.25rem 0.5rem', width: 'auto' }}
                        defaultValue={tienda.planId || 0}
                        onChange={(e) => handleUpdatePlan(tienda.id, Number(e.target.value), false)}
                      >
                        {planes.map(p => (
                          <option key={p.id === null ? 0 : p.id} value={p.id === null ? 0 : p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {tienda.suscripcionInicio ? (
                        <div className="text-sm">
                          <div><span className="font-semibold">Inicio:</span> {new Date(tienda.suscripcionInicio).toLocaleDateString()}</div>
                          <div><span className="font-semibold">Fin:</span> {new Date(tienda.suscripcionFin).toLocaleDateString()}</div>
                        </div>
                      ) : (
                        <span className="text-muted text-sm">Sin suscripción</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${tienda.activa ? 'badge-success' : 'badge-danger'}`}>
                        {tienda.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {tienda.planId && (
                          <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem' }} onClick={() => handleUpdatePlan(tienda.id, tienda.planId, true)}>
                            Renovar
                          </button>
                        )}
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.75rem' }} onClick={() => handleDelete(tienda.id)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tiendas.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted">No hay tiendas registradas</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
