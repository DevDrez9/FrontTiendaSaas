import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdvancedView from './AdvancedView';
import SimpleView from './SimpleView';
import TiendaNoDisponible, { esTiendaNoDisponible } from './TiendaNoDisponible';

export default function StoreRouter() {
  const { storeDomain } = useParams();
  const [storeData, setStoreData] = useState<any>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noDisponible, setNoDisponible] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchStoreAndInitialProducts = async () => {
      try {
        setLoading(true);
        // Fetch store by domain
        const resStore = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tiendas/dominio/${storeDomain}`);
        const tienda = resStore.data;
        setStoreData(tienda);

        // Fetch products for this store (page 1, limit 20)
        const resProd = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/producto/tienda/${tienda.id}?page=1&limit=20`);
        setProductos(resProd.data.data || []); 
        setHasMore(1 < (resProd.data.meta?.pages || 1));
        setPage(1);
      } catch (err) {
        console.error(err);
        if (esTiendaNoDisponible(err)) setNoDisponible(true);
        else setError('Tienda no encontrada');
      } finally {
        setLoading(false);
      }
    };

    if (storeDomain) {
      fetchStoreAndInitialProducts();
    }
  }, [storeDomain]);

  const loadMoreProducts = useCallback(async () => {
    if (!storeData || loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const resProd = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/producto/tienda/${storeData.id}?page=${nextPage}&limit=20`);
      
      const newProducts = resProd.data.data || [];
      setProductos(prev => [...prev, ...newProducts]);
      setHasMore(nextPage < (resProd.data.meta?.pages || 1));
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [storeData, page, loadingMore, hasMore]);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      // Check if we are near the bottom (within 200px)
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreProducts]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando tienda...</div>;
  if (noDisponible) return <TiendaNoDisponible />;
  if (error || !storeData) return <div className="flex items-center justify-center min-h-screen text-danger">{error}</div>;

  const isBasicPlan = !storeData.plan || storeData.plan.nivel < 2;

  // Render storefront, appending a loading indicator at the bottom if fetching more
  return (
    <>
      {isBasicPlan ? (
        <SimpleView storeData={storeData} productos={productos} />
      ) : (
        <AdvancedView storeData={storeData} productos={productos} />
      )}
      
      {loadingMore && (
        <div className="text-center py-8 text-muted bg-gray-50" style={{ paddingBottom: '4rem' }}>
          Cargando más productos...
        </div>
      )}
      {!hasMore && productos.length > 0 && (
        <div className="text-center py-8 text-muted bg-gray-50" style={{ paddingBottom: '4rem' }}>
          Has llegado al final del catálogo.
        </div>
      )}
    </>
  );
}

