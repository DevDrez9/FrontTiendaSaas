import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import CheckoutModal from './CheckoutModal';
import AddToCartModal from './AddToCartModal';
import { ShoppingCart, Plus } from 'lucide-react';
import './Storefront.css';

export default function SimpleView({ storeData, productos }: { storeData: any, productos: any[] }) {
  const config = storeData.configWeb;
  const colorPrimario = config?.colorPrimario || '#000000';

  const { addToCart, items, getTotal } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForCart, setSelectedProductForCart] = useState<any>(null);

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ paddingBottom: '5rem' }}>
      <header className="bg-white shadow-sm sticky" style={{ top: 0, zIndex: 40 }}>
        <div className="container flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold">{storeData.nombre}</h1>
            {storeData.descripcion && <p className="text-sm text-muted">{storeData.descripcion}</p>}
          </div>
          
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="relative p-2 text-muted"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <ShoppingCart size={28} />
            {totalItems > 0 && (
              <span className="absolute badge badge-danger" style={{ top: '-4px', right: '-4px', padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="container py-8">
        {productos.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <PackageIcon className="mx-auto mb-4 text-muted" size={64} style={{ display: 'block' }} />
            <h2 className="text-xl font-semibold mb-2">Catálogo Vacío</h2>
            <p>Esta tienda aún no tiene productos disponibles.</p>
          </div>
        ) : (
          <div className="products-grid gap-4">
            {productos.map(p => (
              <div key={p.id} className="card store-product-card flex flex-col">
                <div className="store-image-wrapper bg-gray-50" style={{ aspectRatio: '1/1' }}>
                  <div style={{ display: 'block', height: '100%' }}>
                    {p.imagenUrl ? (
                      <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">Sin Imagen</div>
                    )}
                  </div>
                  {p.enOferta && (
                    <span className="absolute badge badge-danger" style={{ top: '8px', left: '8px' }}>
                      OFERTA
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-medium mb-2" style={{ flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.nombre}</h3>
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      {p.enOferta && p.precioOferta ? (
                        <>
                          <span className="text-xs text-muted" style={{ textDecoration: 'line-through', display: 'block' }}>Bs{p.precio}</span>
                          <span className="font-bold text-lg text-primary">Bs{p.precioOferta}</span>
                        </>
                      ) : (
                        <span className="font-bold text-lg">Bs{p.precio}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => setSelectedProductForCart(p)}
                      className="btn btn-primary rounded-full p-2"
                      title="Agregar al carrito"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Simple */}
      <footer className="mt-auto" style={{ backgroundColor: '#111827', color: '#d1d5db', padding: '3rem 0 1rem' }}>
        <div className="container grid gap-8" style={{ maxWidth: '1280px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#fff', margin: '0 0 1rem 0' }}>{config?.nombreSitio || storeData.nombre}</h3>
            <p className="text-sm" style={{ color: '#9ca3af', margin: 0 }}>
              {storeData.descripcion || 'La mejor tienda en línea construida con esta plataforma.'}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#fff', margin: '0 0 1rem 0' }}>¿Quieres tu propia tienda?</h4>
            <p className="text-sm mb-4" style={{ color: '#9ca3af' }}>Crea tu propio catálogo en línea en minutos con nuestra plataforma.</p>
            <a href="/" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: colorPrimario, color: '#ffffff' }}>
              Crea tu catálogo gratis
            </a>
          </div>
        </div>
        <div className="container mt-8 pt-8 text-sm text-center" style={{ maxWidth: '1280px', borderTop: '1px solid #1f2937', color: '#9ca3af', marginTop: '2rem', paddingTop: '2rem' }}>
          &copy; {new Date().getFullYear()} {config?.nombreSitio || storeData.nombre}. Todos los derechos reservados.
        </div>
      </footer>

      {totalItems > 0 && (
        <div className="store-floating-cart">
          <div>
            <div className="text-sm text-muted">{totalItems} items</div>
            <div className="font-bold text-lg">Bs{getTotal().toFixed(2)}</div>
          </div>
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="btn btn-primary rounded-full"
          >
            Ver Carrito
          </button>
        </div>
      )}

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        colorPrimario={colorPrimario}
        whatsapp={config?.whatsapp}
      />

      <AddToCartModal
        isOpen={!!selectedProductForCart}
        onClose={() => setSelectedProductForCart(null)}
        producto={selectedProductForCart}
        tiendaId={storeData.id}
      />
    </div>
  );
}

// Dummy icon for empty state
const PackageIcon = ({ className, size, style }: { className?: string, size?: number, style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
