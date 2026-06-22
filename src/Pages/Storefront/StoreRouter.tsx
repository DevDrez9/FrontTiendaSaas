import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdvancedView from './AdvancedView';
import SimpleView from './SimpleView';

export default function StoreRouter() {
  const { storeDomain } = useParams();
  const [storeData, setStoreData] = useState<any>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        // Fetch store by domain
        const resStore = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas/dominio/${storeDomain}`);
        const tienda = resStore.data;
        setStoreData(tienda);

        // Fetch products for this store
        const resProd = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/producto/tienda/${tienda.id}`);
        setProductos(resProd.data.data || []); // Assuming paginated response has .data
      } catch (err) {
        console.error(err);
        setError('Tienda no encontrada');
      } finally {
        setLoading(false);
      }
    };

    if (storeDomain) {
      fetchStore();
    }
  }, [storeDomain]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando tienda...</div>;
  if (error || !storeData) return <div className="flex items-center justify-center min-h-screen text-danger">{error}</div>;

  // Plan logic: Assuming plan level < 5 is Basic, level >= 5 is Advanced
  // Or maybe check if plan.nombre contains 'Básico'
  const isBasicPlan = !storeData.plan || storeData.plan.nivel < 2; // Fallback to basic if no plan

  if (isBasicPlan) {
    return <SimpleView storeData={storeData} productos={productos} />;
  }

  return <AdvancedView storeData={storeData} productos={productos} />;
}

