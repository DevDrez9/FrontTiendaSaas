import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import CheckoutModal from './CheckoutModal';
import './Storefront.css';

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [cantidad, setCantidad] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { addToCart, items } = useCartStore();
  
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/producto/${id}`);
        setProducto(res.data);
        if (res.data.imagenes && res.data.imagenes.length > 0) {
          setActiveImage(res.data.imagenes[0].url);
        } else if (res.data.imagenUrl) {
          setActiveImage(res.data.imagenUrl);
        }
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-muted">Cargando detalles del producto...</div>;
  }

  if (!producto) {
    return <div className="p-8 text-center text-danger">Producto no encontrado</div>;
  }

  // Verificar si la tienda tiene el plan Profesional (nivel >= 3)
  if ((producto.tienda?.plan?.nivel || 0) < 3) {
    return (
      <div className="p-8 text-center" style={{ marginTop: '100px' }}>
        <h2 className="text-2xl font-bold mb-4">Página de detalles no disponible</h2>
        <p className="text-muted mb-8">Esta tienda no cuenta con el plan Profesional necesario para ver detalles interactivos.</p>
        <Link to={`/${producto.tienda?.dominio || ''}`} className="btn btn-primary">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const config = producto.tienda?.configWeb;
  const colorPrimario = config?.colorPrimario || '#000000';
  const colorSecundario = config?.colorSecundario || '#ffffff';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header className="shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: colorSecundario }}>
        <div style={{ backgroundColor: colorPrimario, color: '#fff', textAlign: 'center', padding: '0.25rem 0', fontSize: '0.75rem' }}>
          Envíos a todo el país | Compra segura
        </div>

        <div className="container flex items-center justify-between relative" style={{ height: '5rem', maxWidth: '1280px' }}>
          <div className="flex items-center gap-4">
            <Link to={`/${producto.tienda?.dominio || ''}`} style={{ textDecoration: 'none' }}>
              {config?.logoUrl ? (
                <img src={config.logoUrl} alt={config?.nombreSitio || producto.tienda?.nombre} style={{ height: '2.5rem' }} />
              ) : (
                <h1 className="text-2xl" style={{ color: colorPrimario, fontWeight: 900, letterSpacing: '-0.025em', margin: 0 }}>
                  {config?.nombreSitio || producto.tienda?.nombre}
                </h1>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="relative flex items-center gap-2"
              style={{ color: colorPrimario, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <ShoppingCart size={24} />
              <span className="font-medium mobile-hidden">Mi Carrito</span>
              {totalItems > 0 && (
                <span className="absolute badge badge-danger" style={{ top: '-0.5rem', right: '-0.5rem', padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="product-detail-container flex-1" style={{ width: '100%' }}>
        <div className="product-detail-header">
        <Link to={`/${producto.tienda?.dominio || ''}`} className="back-link">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>
      </div>

      <div className="product-detail-content">
        <div className="product-gallery">
          <div className="main-image-container">
            {activeImage ? (
              <img src={activeImage} alt={producto.nombre} className="main-image" />
            ) : (
              <div className="no-image">Sin imagen</div>
            )}
          </div>
          
          {producto.imagenes && producto.imagenes.length > 1 && (
            <div className="thumbnail-list">
              {producto.imagenes.map((img: any) => (
                <div 
                  key={img.id} 
                  className={`thumbnail ${activeImage === img.url ? 'active' : ''}`}
                  onClick={() => setActiveImage(img.url)}
                >
                  <img src={img.url} alt={`Vista de ${producto.nombre}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          {producto.categoria && (
            <span className="product-category">{producto.categoria.nombre}</span>
          )}
          
          <h1 className="product-title">{producto.nombre}</h1>
          
          <div className="product-price-container">
            <span className="product-price">${producto.precio}</span>
            {producto.enOferta && producto.precioOferta > 0 && (
              <span className="product-price-offer">${producto.precioOferta}</span>
            )}
          </div>
          
          <p className="product-description">
            {producto.descripcion || 'Sin descripción disponible para este producto.'}
          </p>

          <div className="product-features">
            <div className="feature-item" style={{ fontSize: '1.1rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Ciudad de origen: {producto.tienda?.ciudad || 'No especificada'}
            </div>
          </div>

          <div className="product-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="qty-control" style={{ height: '48px' }}>
              <button 
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                disabled={cantidad <= 1}
              >-</button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad(cantidad + 1)}>+</button>
            </div>
            
            <button 
              className="btn btn-primary add-to-cart-btn"
              style={{ flex: 1, height: '48px' }}
              onClick={() => {
                addToCart(producto.tiendaId, {
                  id: producto.id,
                  nombre: producto.nombre,
                  precio: Number(producto.enOferta && producto.precioOferta ? producto.precioOferta : producto.precio),
                  imagenUrl: activeImage || producto.imagenUrl
                }, cantidad);
                // Resetear cantidad después de agregar
                setCantidad(1);
              }}
            >
              <ShoppingCart size={20} /> Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto" style={{ backgroundColor: '#111827', color: '#d1d5db', padding: '3rem 0 1rem' }}>
        <div className="container grid gap-8" style={{ maxWidth: '1280px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#fff', margin: '0 0 1rem 0' }}>{config?.nombreSitio || producto.tienda?.nombre}</h3>
            <p className="text-sm" style={{ color: '#9ca3af', margin: 0 }}>
              La mejor tienda en línea construida con esta plataforma.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#fff', margin: '0 0 1rem 0' }}>¿Quieres tu propia tienda?</h4>
            <p className="text-sm mb-4" style={{ color: '#9ca3af' }}>Crea tu propio catálogo en línea en minutos con nuestra plataforma.</p>
            <a href="/" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: colorPrimario, color: colorSecundario }}>
              Crea tu catálogo gratis
            </a>
          </div>
        </div>
        <div className="container mt-8 pt-8 text-sm text-center" style={{ maxWidth: '1280px', borderTop: '1px solid #1f2937', color: '#9ca3af', marginTop: '2rem', paddingTop: '2rem' }}>
          &copy; {new Date().getFullYear()} {config?.nombreSitio || producto.tienda?.nombre}. Todos los derechos reservados.
        </div>
      </footer>

      {/* Modal de checkout */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        colorPrimario={colorPrimario}
        whatsapp={config?.whatsapp}
      />
    </div>
  );
}
