import { useState } from 'react';
import { ShoppingCart, Menu, Plus, X, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import CheckoutModal from './CheckoutModal';
import AddToCartModal from './AddToCartModal';
import './Storefront.css';

export default function AdvancedView({ storeData, productos }: { storeData: any, productos: any[] }) {
  const config = storeData.configWeb;
  const colorPrimario = config?.colorPrimario || '#000000';
  const colorSecundario = config?.colorSecundario || '#ffffff';

  const { addToCart, items } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProductForCart, setSelectedProductForCart] = useState<any>(null);

  // Extraer categorías únicas de los productos
  const categorias = Array.from(new Map(productos.filter(p => p.categoria).map(p => [p.categoria.id, p.categoria])).values());
  const productosMostrados = categoriaActiva ? productos.filter(p => p.categoriaId === categoriaActiva) : productos;
  const categoriaNombre = categoriaActiva ? categorias.find((c: any) => c.id === categoriaActiva)?.nombre : 'Todos los productos';

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9fafb' }}>
      {/* Header Avanzado */}
      <header className="shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: colorSecundario }}>
        {/* Top bar (opcional, p.ej. anuncio) */}
        <div style={{ backgroundColor: colorPrimario, color: '#fff', textAlign: 'center', padding: '0.25rem 0', fontSize: '0.75rem' }}>
          Envíos a todo el país | Compra segura
        </div>

        <div className="container flex items-center justify-between relative" style={{ height: '5rem', maxWidth: '1280px' }}>
          <div className="flex items-center gap-4">
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', alignItems: 'center' }}
            >
              <Menu size={24} color={colorPrimario} />
            </button>
            {config?.logoUrl ? (
              <img src={config.logoUrl} alt={config.nombreSitio} style={{ height: '2.5rem' }} />
            ) : (
              <h1 className="text-2xl" style={{ color: colorPrimario, fontWeight: 900, letterSpacing: '-0.025em', margin: 0 }}>
                {config?.nombreSitio || storeData.nombre}
              </h1>
            )}
          </div>

          <div className="flex-1 items-center justify-center gap-6 desktop-categories" style={{ margin: '0 2rem', overflowX: 'auto' }}>
            <button 
              onClick={() => setCategoriaActiva(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: categoriaActiva === null ? '700' : '500', color: categoriaActiva === null ? colorPrimario : '#4b5563', transition: 'color 0.2s' }}
            >
              Todos
            </button>
            {categorias.map((cat: any) => (
              <button 
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.id)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: categoriaActiva === cat.id ? '700' : '500', color: categoriaActiva === cat.id ? colorPrimario : '#4b5563', transition: 'color 0.2s', whiteSpace: 'nowrap' }}
              >
                {cat.nombre}
              </button>
            ))}
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

          {/* Menú Móvil */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full shadow-md" style={{ backgroundColor: colorSecundario, borderTop: '1px solid #e5e7eb', zIndex: 50 }}>
              <div className="flex flex-col p-4 gap-4">
                <button 
                  onClick={() => { setCategoriaActiva(null); setIsMobileMenuOpen(false); }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1.1rem', fontWeight: categoriaActiva === null ? '700' : '500', color: categoriaActiva === null ? colorPrimario : '#4b5563' }}
                >
                  Todos los productos
                </button>
                {categorias.map((cat: any) => (
                  <button 
                    key={cat.id}
                    onClick={() => { setCategoriaActiva(cat.id); setIsMobileMenuOpen(false); }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1.1rem', fontWeight: categoriaActiva === cat.id ? '700' : '500', color: categoriaActiva === cat.id ? colorPrimario : '#4b5563' }}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Banner Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#111827' }}>
        <div 
          style={{ height: '400px', backgroundImage: `url(${config?.banners?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
      </section>

      {/* Main Content */}
      <main className="container flex-1 py-8" style={{ maxWidth: '1280px' }}>
        <div className="flex justify-between items-end mb-8 pb-4 border-b">
          <h2 className="text-3xl font-bold text-main" style={{ margin: 0 }}>{categoriaNombre}</h2>
        </div>

        {productosMostrados.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <p>No hay productos en esta categoría.</p>
          </div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {productosMostrados.map(p => (
              <div key={p.id} className="card store-product-card flex flex-col overflow-hidden">
                <div className="store-image-wrapper bg-gray-50" style={{ aspectRatio: '4/5' }}>
                  {(storeData.plan?.nivel || 0) >= 3 ? (
                    <Link to={`/producto/${p.id}`} style={{ display: 'block', height: '100%' }}>
                      {p.imagenUrl ? (
                        <img 
                          src={p.imagenUrl} 
                          alt={p.nombre} 
                          className="w-full h-full"
                          style={{ objectFit: 'cover' }} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">No Image</div>
                      )}
                    </Link>
                  ) : (
                    <div style={{ display: 'block', height: '100%' }}>
                      {p.imagenUrl ? (
                        <img 
                          src={p.imagenUrl} 
                          alt={p.nombre} 
                          className="w-full h-full"
                          style={{ objectFit: 'cover' }} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">No Image</div>
                      )}
                    </div>
                  )}
                  {/* Overlay Hover Actions */}
                  <div className="store-gradient-overlay">
                    <button 
                      onClick={() => setSelectedProductForCart(p)}
                      className="btn btn-primary w-full shadow-lg"
                      style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center' }}
                    >
                      <Plus size={18} /> Agregar al Carrito
                    </button>
                  </div>
                </div>
                <div className="p-4 text-center">
                  {(storeData.plan?.nivel || 0) >= 3 ? (
                    <Link to={`/producto/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 className="font-medium mb-2 hover-text-primary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 0 0.5rem 0', transition: 'color 0.2s' }}>{p.nombre}</h3>
                    </Link>
                  ) : (
                    <h3 className="font-medium mb-2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 0 0.5rem 0' }}>{p.nombre}</h3>
                  )}
                  <div className="flex justify-center items-center gap-2">
                    {p.enOferta && p.precioOferta ? (
                      <>
                        <span className="text-sm text-muted" style={{ textDecoration: 'line-through' }}>Bs{p.precio}</span>
                        <span className="font-bold text-lg" style={{ color: colorPrimario }}>Bs{p.precioOferta}</span>
                      </>
                    ) : (
                      <span className="font-bold text-lg text-main">Bs{p.precio}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Avanzado */}
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
            <a href="/" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none', backgroundColor: colorPrimario, color: colorSecundario }}>
              Crea tu catálogo gratis
            </a>
          </div>
        </div>
        <div className="container mt-8 pt-8 text-sm text-center" style={{ maxWidth: '1280px', borderTop: '1px solid #1f2937', color: '#9ca3af', marginTop: '2rem', paddingTop: '2rem' }}>
          &copy; {new Date().getFullYear()} {config?.nombreSitio || storeData.nombre}. Todos los derechos reservados.
        </div>
      </footer>

      {/* Modal de checkout */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        colorPrimario={colorPrimario}
        whatsapp={config?.whatsapp}
      />

      {/* Modal para agregar cantidad al carrito */}
      <AddToCartModal
        isOpen={!!selectedProductForCart}
        onClose={() => setSelectedProductForCart(null)}
        producto={selectedProductForCart}
        tiendaId={storeData.id}
      />
    </div>
  );
}
