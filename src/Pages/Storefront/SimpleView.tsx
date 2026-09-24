import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import CheckoutModal from './CheckoutModal';
import AddToCartModal from './AddToCartModal';
import { ShoppingCart, Plus } from 'lucide-react';
import './Storefront.css';
import { fixImageUrl } from '../../config/api';

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
                      <img src={fixImageUrl(p.imagenUrl)} alt={p.nombre} className="w-full h-full" style={{ objectFit: 'cover' }} />
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
                          <span className="text-xs text-muted" style={{ textDecoration: 'line-through', display: 'block' }}>{config?.moneda || 'Bs'} {p.precio}</span>
                          <span className="font-bold text-lg text-primary">{config?.moneda || 'Bs'} {p.precioOferta}</span>
                        </>
                      ) : (
                        <span className="font-bold text-lg">{config?.moneda || 'Bs'} {p.precio}</span>
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
            <div className="font-bold text-lg">{config?.moneda || 'Bs'} {getTotal().toFixed(2)}</div>
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
        moneda={config?.moneda || 'Bs'}
      />

      <AddToCartModal
        isOpen={!!selectedProductForCart}
        onClose={() => setSelectedProductForCart(null)}
        producto={selectedProductForCart}
        tiendaId={storeData.id}
        moneda={config?.moneda || 'Bs'}
      />

      {config?.whatsapp && (
        <a 
          href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="store-whatsapp-float"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#25D366',
            color: '#fff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            zIndex: 100,
            textDecoration: 'none'
          }}
          title="Contactar por WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.052 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
        </a>
      )}
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
