import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShoppingCart,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Check,
  Monitor,
  Smartphone,
  Eye,
  Images,
  Layers,
  LayoutGrid,
  Maximize2,
  MapPin,
} from 'lucide-react';
import './PlanDemo.css';

export type PlanKey = 'basico' | 'avanzado' | 'profesional';

interface DemoProduct {
  id: number;
  nombre: string;
  precio: number;
  precioOferta?: number;
  enOferta?: boolean;
  categoriaId: number;
  categoria: { id: number; nombre: string };
  descripcion: string;
  imagenUrl: string;
  imagenes: { id: number; url: string }[];
}

const DEMO_CATEGORIES = [
  { id: 1, nombre: 'Calzado' },
  { id: 2, nombre: 'Chaquetas' },
  { id: 3, nombre: 'Accesorios' },
  { id: 4, nombre: 'Deportivo' },
];

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 101,
    nombre: 'Zapatillas Urban Air Pro',
    precio: 420,
    precioOferta: 349,
    enOferta: true,
    categoriaId: 1,
    categoria: { id: 1, nombre: 'Calzado' },
    descripcion:
      'Zapatillas urbanas de alto confort con suela amortiguada, tejido respirable y refuerzo lateral. Ideales para uso diario o caminatas largas.',
    imagenUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 102,
    nombre: 'Chaqueta Térmica Boreal',
    precio: 520,
    enOferta: false,
    categoriaId: 2,
    categoria: { id: 2, nombre: 'Chaquetas' },
    descripcion:
      'Chaqueta impermeable con interior térmico ultraligero, cierres sellados y capucha desmontable. Diseñada para climas fríos y viento.',
    imagenUrl:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 103,
    nombre: 'Mochila Minimalista Impermeable',
    precio: 260,
    precioOferta: 210,
    enOferta: true,
    categoriaId: 3,
    categoria: { id: 3, nombre: 'Accesorios' },
    descripcion:
      'Compartimento acolchado para laptop de hasta 16 pulgadas, bolsillo oculto antirrobo y tela repelente al agua con acabados mate.',
    imagenUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 104,
    nombre: 'Reloj Cronógrafo Eclipse',
    precio: 680,
    enOferta: false,
    categoriaId: 3,
    categoria: { id: 3, nombre: 'Accesorios' },
    descripcion:
      'Caja de acero inoxidable, cristal de zafiro resistente a rayaduras y correa intercambiable. Resistencia al agua 5 ATM.',
    imagenUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 105,
    nombre: 'Bolso Deportivo ProFit',
    precio: 310,
    precioOferta: 265,
    enOferta: true,
    categoriaId: 4,
    categoria: { id: 4, nombre: 'Deportivo' },
    descripcion:
      'Bolso de entrenamiento con división ventilada para calzado, bolsillos térmicos laterales y correa ergonómica ajustable.',
    imagenUrl:
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 106,
    nombre: 'Tenis Running Velocity X',
    precio: 490,
    enOferta: false,
    categoriaId: 1,
    categoria: { id: 1, nombre: 'Calzado' },
    descripcion:
      'Suela reactiva ultraligera pensada para corredores de media y larga distancia con malla transpirable sin costuras.',
    imagenUrl:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
    imagenes: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

const PLAN_CONFIGS: Record<
  PlanKey,
  {
    nivel: 1 | 2 | 3;
    nombre: string;
    subtitulo: string;
    precioMes: string;
    badge?: string;
    icono: typeof LayoutGrid;
    color: string;
    resumen: string[];
    diferenciador: string;
  }
> = {
  basico: {
    nivel: 1,
    nombre: 'Plan Básico',
    subtitulo: 'Catálogo directo y minimalista',
    precioMes: 'Bs 9.99/mes',
    icono: LayoutGrid,
    color: '#0f172a',
    resumen: [
      'Hasta 20 productos en catálogo',
      '1 imagen por producto',
      'Diseño limpio de carga rápida',
      'Botón directo de pedido por WhatsApp',
    ],
    diferenciador:
      'Vista Simple: muestra tus productos en una cuadrícula directa sin banners ni filtros complejos.',
  },
  avanzado: {
    nivel: 2,
    nombre: 'Plan Avanzado',
    subtitulo: 'Tienda completa con banners y categorías',
    precioMes: 'Bs 29.99/mes',
    badge: 'MÁS POPULAR',
    icono: Layers,
    color: '#2563eb',
    resumen: [
      'Hasta 40 productos en catálogo',
      'Banner promocional principal (Hero)',
      'Filtro interactivo por categorías',
      'Colores personalizados de tu marca',
    ],
    diferenciador:
      'Vista Avanzada: incluye barra de anuncio, banner promocional, burbujas de categorías y tarjetas estilizadas.',
  },
  profesional: {
    nivel: 3,
    nombre: 'Plan Profesional',
    subtitulo: 'Galería multi-foto y página de detalle interactiva',
    precioMes: 'Bs 59.99/mes',
    badge: 'EXPERIENCIA COMPLETA',
    icono: Images,
    color: '#7c3aed',
    resumen: [
      'Hasta 80 productos en catálogo',
      'Hasta 4 imágenes por producto con galería',
      'Página de detalle interactiva al hacer clic',
      'Selector de cantidad y carrito integrado',
    ],
    diferenciador:
      'Vista Profesional: haz clic en cualquier producto para abrir su ficha completa con galería de 4 fotos, descripción y carrito.',
  },
};

const BRAND_COLORS = [
  { name: 'Azul Real', primary: '#2563eb' },
  { name: 'Violeta Pro', primary: '#7c3aed' },
  { name: 'Esmeralda', primary: '#059669' },
  { name: 'Ónix Elegante', primary: '#111827' },
  { name: 'Coral Vivo', primary: '#e11d48' },
];

interface PlanDemoShowcaseProps {
  selectedPlan?: PlanKey;
  onSelectPlan?: (plan: PlanKey) => void;
  fullPage?: boolean;
}

export function PlanDemoShowcase({
  selectedPlan: controlledPlan,
  onSelectPlan,
  fullPage = false,
}: PlanDemoShowcaseProps) {
  const [internalPlan, setInternalPlan] = useState<PlanKey>('avanzado');
  const activePlan = controlledPlan ?? internalPlan;

  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [brandColor, setBrandColor] = useState<string>('#2563eb');
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [detalleProducto, setDetalleProducto] = useState<DemoProduct | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [demoCartCount, setDemoCartCount] = useState<number>(2);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePlanChange = (plan: PlanKey) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
    } else {
      setInternalPlan(plan);
    }
    setDetalleProducto(null);
    if (plan === 'basico') {
      setCategoriaActiva(null);
    }
  };

  const openProductDetail = (prod: DemoProduct) => {
    setDetalleProducto(prod);
    setActiveImage(prod.imagenes?.[0]?.url || prod.imagenUrl);
    setCantidad(1);
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const currentConfig = PLAN_CONFIGS[activePlan];
  const effectivePrimaryColor = activePlan === 'basico' ? '#111827' : brandColor;

  const productosFiltrados =
    activePlan !== 'basico' && categoriaActiva
      ? DEMO_PRODUCTS.filter((p) => p.categoriaId === categoriaActiva)
      : DEMO_PRODUCTS;

  const categoriaNombre = categoriaActiva
    ? DEMO_CATEGORIES.find((c) => c.id === categoriaActiva)?.nombre
    : 'Todos los productos';

  return (
    <div className={`plan-demo-wrapper ${fullPage ? 'plan-demo-fullpage' : ''}`}>
      {/* Selector de los 3 Planes */}
      <div className="plan-demo-tabs" role="tablist" aria-label="Seleccionar plan para vista previa">
        {(Object.keys(PLAN_CONFIGS) as PlanKey[]).map((key) => {
          const info = PLAN_CONFIGS[key];
          const Icon = info.icono;
          const isSelected = activePlan === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`plan-demo-tab ${isSelected ? 'active' : ''}`}
              onClick={() => handlePlanChange(key)}
            >
              {info.badge && <span className="plan-demo-tab-badge">{info.badge}</span>}
              <div className="plan-demo-tab-header">
                <div className="plan-demo-tab-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="plan-demo-tab-title">{info.nombre}</div>
                  <div className="plan-demo-tab-price">{info.precioMes}</div>
                </div>
              </div>
              <p className="plan-demo-tab-desc">{info.subtitulo}</p>
            </button>
          );
        })}
      </div>

      {/* Barra informativa + controles de la demo */}
      <div className="plan-demo-toolbar">
        <div className="plan-demo-features-pills">
          {currentConfig.resumen.map((item, idx) => (
            <span key={idx} className="plan-demo-feature-pill">
              <Check size={14} /> {item}
            </span>
          ))}
        </div>

        <div className="plan-demo-controls">
          {activePlan !== 'basico' && (
            <div className="plan-demo-color-picker" title="Probar color de marca">
              <span className="text-xs font-semibold text-muted">Color:</span>
              {BRAND_COLORS.map((c) => (
                <button
                  key={c.primary}
                  type="button"
                  className={`color-dot ${brandColor === c.primary ? 'active' : ''}`}
                  style={{ backgroundColor: c.primary }}
                  onClick={() => setBrandColor(c.primary)}
                  title={c.name}
                  aria-label={`Color ${c.name}`}
                />
              ))}
            </div>
          )}

          {activePlan === 'profesional' && (
            <button
              type="button"
              className="btn btn-primary plan-demo-try-detail-btn"
              onClick={() =>
                detalleProducto ? setDetalleProducto(null) : openProductDetail(DEMO_PRODUCTS[0])
              }
            >
              <Images size={16} />
              {detalleProducto ? 'Volver al catálogo' : 'Ver ficha con 4 fotos'}
            </button>
          )}

          <div className="plan-demo-device-toggle">
            <button
              type="button"
              className={deviceMode === 'desktop' ? 'active' : ''}
              onClick={() => setDeviceMode('desktop')}
              title="Vista Computadora"
            >
              <Monitor size={16} />
              <span>PC</span>
            </button>
            <button
              type="button"
              className={deviceMode === 'mobile' ? 'active' : ''}
              onClick={() => setDeviceMode('mobile')}
              title="Vista Celular"
            >
              <Smartphone size={16} />
              <span>Móvil</span>
            </button>
          </div>

          {!fullPage && (
            <Link
              to={`/demo?plan=${activePlan}`}
              className="btn btn-secondary plan-demo-fullscreen-link"
              title="Abrir demo en pantalla completa"
            >
              <Maximize2 size={15} />
              <span>Pantalla completa</span>
            </Link>
          )}
        </div>
      </div>

      {/* Cinta explicativa según el plan activo */}
      <div className="plan-demo-callout">
        <Sparkles size={18} className="plan-demo-callout-icon" />
        <span>{currentConfig.diferenciador}</span>
        {activePlan === 'profesional' && !detalleProducto && (
          <button
            type="button"
            className="plan-demo-callout-action"
            onClick={() => openProductDetail(DEMO_PRODUCTS[0])}
          >
            Haz clic en cualquier producto para probarlo →
          </button>
        )}
      </div>

      {/* Ventana de navegador simulada con la tienda real */}
      <div
        className={`plan-demo-browser ${
          deviceMode === 'mobile' ? 'plan-demo-browser--mobile' : ''
        }`}
      >
        <div className="plan-demo-browser-bar">
          <div className="browser-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="browser-url">
            <span className="browser-lock">🔒</span>
            <span>
              micatalogo.com/<strong>urban-style-bo</strong>
              {detalleProducto ? `/producto/${detalleProducto.id}` : ''}
            </span>
          </div>
          <div className="browser-plan-tag" style={{ backgroundColor: effectivePrimaryColor }}>
            Vista: {currentConfig.nombre}
          </div>
        </div>

        {/* Notificación flotante dentro del demo */}
        {toastMsg && <div className="plan-demo-toast">{toastMsg}</div>}

        <div className="plan-demo-viewport">
          {/* ==========================================
              OPCIÓN 1: PLAN BÁSICO (SimpleView)
          ========================================== */}
          {activePlan === 'basico' && (
            <div className="demo-store-simple">
              <header className="demo-simple-header">
                <div className="demo-simple-header-inner">
                  <div>
                    <h3 className="demo-store-brand">Urban Style BO</h3>
                    <p className="demo-store-desc">
                      Moda urbana y accesorios con envíos a toda Bolivia
                    </p>
                  </div>
                  <button
                    type="button"
                    className="demo-cart-btn"
                    onClick={() =>
                      triggerToast(
                        '🛒 Carrito de compras: tus clientes pueden armar su pedido y enviarlo por WhatsApp.'
                      )
                    }
                  >
                    <ShoppingCart size={24} />
                    <span className="demo-cart-badge">{demoCartCount}</span>
                  </button>
                </div>
              </header>

              <div className="demo-store-body">
                <div className="demo-products-grid demo-products-grid--simple">
                  {DEMO_PRODUCTS.map((p) => (
                    <div key={p.id} className="card store-product-card flex flex-col">
                      <div className="store-image-wrapper bg-gray-50" style={{ aspectRatio: '1/1' }}>
                        <img
                          src={p.imagenUrl}
                          alt={p.nombre}
                          className="w-full h-full"
                          style={{ objectFit: 'cover' }}
                        />
                        {p.enOferta && (
                          <span
                            className="absolute badge badge-danger"
                            style={{ top: '8px', left: '8px' }}
                          >
                            OFERTA
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="demo-prod-title">{p.nombre}</h4>
                        <div className="flex items-end justify-between mt-4">
                          <div>
                            {p.enOferta && p.precioOferta ? (
                              <>
                                <span
                                  className="text-xs text-muted"
                                  style={{ textDecoration: 'line-through', display: 'block' }}
                                >
                                  Bs {p.precio}
                                </span>
                                <span className="font-bold text-lg text-primary">
                                  Bs {p.precioOferta}
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-lg">Bs {p.precio}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              triggerToast(
                                `💬 Abre WhatsApp con el mensaje: "Hola, quiero pedir ${p.nombre} - Bs ${
                                  p.precioOferta || p.precio
                                }"`
                              )
                            }
                            className="btn rounded-full p-2 shadow-sm"
                            style={{ backgroundColor: '#25D366', color: '#fff', border: 'none' }}
                            title="Pedir por WhatsApp"
                          >
                            <MessageCircle size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="demo-store-footer">
                <div>
                  <strong>Urban Style BO</strong>
                  <p>Catálogo digital creado con micatalogo.</p>
                </div>
                <span className="demo-footer-badge">Plan Básico · Hasta 20 productos</span>
              </footer>
            </div>
          )}

          {/* ==========================================
              OPCIÓN 2 y 3: PLAN AVANZADO Y PROFESIONAL
          ========================================== */}
          {activePlan !== 'basico' && !detalleProducto && (
            <div className="demo-store-advanced">
              {/* Top announcement bar */}
              <div
                className="demo-top-announcement"
                style={{ backgroundColor: effectivePrimaryColor }}
              >
                Envíos a todo el país | Compra segura
              </div>

              {/* Header Avanzado */}
              <header className="demo-advanced-header">
                <div className="demo-advanced-header-inner">
                  <h3 className="demo-advanced-logo" style={{ color: effectivePrimaryColor }}>
                    URBAN STYLE BO
                  </h3>
                  <button
                    type="button"
                    className="demo-advanced-cart"
                    style={{ color: effectivePrimaryColor }}
                    onClick={() =>
                      triggerToast(
                        '🛒 Carrito activo: el cliente revisa su pedido completo antes de enviarlo a tu WhatsApp.'
                      )
                    }
                  >
                    <ShoppingCart size={22} />
                    <span className="mobile-hidden font-semibold">Mi Carrito</span>
                    <span className="demo-cart-badge">{demoCartCount}</span>
                  </button>
                </div>
              </header>

              {/* Hero Banner Promocional */}
              <div className="demo-hero-banner">
                <div className="demo-hero-banner-overlay">
                  <span className="demo-hero-tag">NUEVA COLECCIÓN 2026</span>
                  <h2>Estilo Urbano & Equipamiento Pro</h2>
                  <p>Descuentos especiales de temporada en productos seleccionados</p>
                </div>
              </div>

              {/* Burbujas de Categorías */}
              <div className="demo-categories-bar">
                <button
                  type="button"
                  onClick={() => setCategoriaActiva(null)}
                  className="category-bubble"
                  style={{
                    backgroundColor:
                      categoriaActiva === null ? effectivePrimaryColor : '#ffffff',
                    color: categoriaActiva === null ? '#ffffff' : '#4b5563',
                    border: `2px solid ${
                      categoriaActiva === null ? effectivePrimaryColor : '#e5e7eb'
                    }`,
                  }}
                >
                  Todos
                </button>
                {DEMO_CATEGORIES.map((cat) => {
                  const active = categoriaActiva === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoriaActiva(cat.id)}
                      className="category-bubble"
                      style={{
                        backgroundColor: active ? effectivePrimaryColor : '#ffffff',
                        color: active ? '#ffffff' : '#4b5563',
                        border: `2px solid ${active ? effectivePrimaryColor : '#e5e7eb'}`,
                      }}
                    >
                      {cat.nombre}
                    </button>
                  );
                })}
              </div>

              {/* Listado de productos */}
              <div className="demo-store-body">
                <div className="demo-category-heading">
                  <h4>{categoriaNombre}</h4>
                  {activePlan === 'profesional' && (
                    <span className="demo-pro-hint">
                      <Eye size={15} /> Haz clic en un producto para ver sus 4 fotos y detalles
                    </span>
                  )}
                </div>

                <div className="demo-products-grid">
                  {productosFiltrados.map((p) => (
                    <div
                      key={p.id}
                      className={`card store-product-card flex flex-col overflow-hidden ${
                        activePlan === 'profesional' ? 'demo-card-clickable' : ''
                      }`}
                      onClick={() => {
                        if (activePlan === 'profesional') {
                          openProductDetail(p);
                        }
                      }}
                    >
                      <div
                        className="store-image-wrapper bg-gray-50"
                        style={{ aspectRatio: '4/5' }}
                      >
                        <img
                          src={p.imagenUrl}
                          alt={p.nombre}
                          className="w-full h-full"
                          style={{ objectFit: 'cover' }}
                        />
                        {p.enOferta && (
                          <span
                            className="absolute badge badge-danger"
                            style={{ top: '10px', left: '10px' }}
                          >
                            OFERTA
                          </span>
                        )}
                        {activePlan === 'profesional' && (
                          <span className="demo-multi-photo-badge">
                            <Images size={13} /> {p.imagenes.length} fotos
                          </span>
                        )}

                        <div className="store-gradient-overlay">
                          {activePlan === 'profesional' ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openProductDetail(p);
                              }}
                              className="btn w-full shadow-lg"
                              style={{
                                padding: '0.65rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: effectivePrimaryColor,
                                color: '#fff',
                                border: 'none',
                              }}
                            >
                              <Eye size={16} /> Ver galería y detalles
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerToast(
                                  `💬 Pedido por WhatsApp: "${p.nombre}" (${
                                    p.precioOferta || p.precio
                                  } Bs)`
                                );
                              }}
                              className="btn w-full shadow-lg"
                              style={{
                                padding: '0.65rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: '#25D366',
                                color: '#fff',
                                border: 'none',
                              }}
                            >
                              <MessageCircle size={16} /> Pedir por WhatsApp
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-4 text-center">
                        <h4 className="demo-prod-title-advanced">{p.nombre}</h4>
                        <div className="flex justify-center items-center gap-2 mt-2">
                          {p.enOferta && p.precioOferta ? (
                            <>
                              <span
                                className="text-sm text-muted"
                                style={{ textDecoration: 'line-through' }}
                              >
                                Bs {p.precio}
                              </span>
                              <span
                                className="font-bold text-lg"
                                style={{ color: effectivePrimaryColor }}
                              >
                                Bs {p.precioOferta}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-lg text-main">Bs {p.precio}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="demo-store-footer">
                <div>
                  <strong>URBAN STYLE BO</strong>
                  <p>La mejor experiencia de compra en línea.</p>
                </div>
                <span className="demo-footer-badge">
                  {activePlan === 'avanzado'
                    ? 'Plan Avanzado · Hasta 40 productos'
                    : 'Plan Profesional · Hasta 80 productos y 4 fotos c/u'}
                </span>
              </footer>
            </div>
          )}

          {/* ==========================================
              OPCIÓN 3 (DETALLE): PÁGINA INTERACTIVA DE PRODUCTO (Plan Profesional)
          ========================================== */}
          {activePlan === 'profesional' && detalleProducto && (
            <div className="demo-store-advanced">
              <div
                className="demo-top-announcement"
                style={{ backgroundColor: effectivePrimaryColor }}
              >
                Envíos a todo el país | Compra segura
              </div>

              <header className="demo-advanced-header">
                <div className="demo-advanced-header-inner">
                  <button
                    type="button"
                    onClick={() => setDetalleProducto(null)}
                    className="demo-advanced-logo"
                    style={{
                      color: effectivePrimaryColor,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    URBAN STYLE BO
                  </button>
                  <button
                    type="button"
                    className="demo-advanced-cart"
                    style={{ color: effectivePrimaryColor }}
                    onClick={() =>
                      triggerToast(`🛒 Tienes ${demoCartCount} productos en el carrito de prueba.`)
                    }
                  >
                    <ShoppingCart size={22} />
                    <span className="mobile-hidden font-semibold">Mi Carrito</span>
                    <span className="demo-cart-badge">{demoCartCount}</span>
                  </button>
                </div>
              </header>

              <div className="demo-detail-wrapper">
                <button
                  type="button"
                  className="demo-back-btn"
                  onClick={() => setDetalleProducto(null)}
                >
                  <ArrowLeft size={16} /> Volver a la tienda
                </button>

                <div className="demo-detail-card">
                  {/* Galería de hasta 4 fotos */}
                  <div className="demo-detail-gallery">
                    <div className="demo-detail-main-img">
                      <img src={activeImage} alt={detalleProducto.nombre} />
                      <span className="demo-exclusive-pro-tag">
                        Exclusivo Plan Profesional · Galería Multi-Foto
                      </span>
                    </div>
                    <div className="demo-detail-thumbs">
                      {detalleProducto.imagenes.map((img, i) => (
                        <button
                          key={img.id}
                          type="button"
                          className={`demo-thumb-btn ${activeImage === img.url ? 'active' : ''}`}
                          style={{
                            borderColor:
                              activeImage === img.url ? effectivePrimaryColor : 'transparent',
                          }}
                          onClick={() => setActiveImage(img.url)}
                        >
                          <img src={img.url} alt={`Vista ${i + 1}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Información interactiva del producto */}
                  <div className="demo-detail-info">
                    <span
                      className="demo-detail-cat"
                      style={{ color: effectivePrimaryColor }}
                    >
                      {detalleProducto.categoria.nombre}
                    </span>
                    <h2 className="demo-detail-title">{detalleProducto.nombre}</h2>

                    <div className="demo-detail-prices">
                      {detalleProducto.enOferta && detalleProducto.precioOferta ? (
                        <>
                          <span
                            className="demo-detail-price-current"
                            style={{ color: effectivePrimaryColor }}
                          >
                            Bs {detalleProducto.precioOferta}
                          </span>
                          <span className="demo-detail-price-old">
                            Bs {detalleProducto.precio}
                          </span>
                        </>
                      ) : (
                        <span className="demo-detail-price-current">
                          Bs {detalleProducto.precio}
                        </span>
                      )}
                    </div>

                    <p className="demo-detail-description">{detalleProducto.descripcion}</p>

                    <div className="demo-detail-origin">
                      <MapPin size={18} style={{ color: effectivePrimaryColor }} />
                      <span>Ciudad de origen: Santa Cruz / Envíos nacionales</span>
                    </div>

                    <div className="demo-detail-actions">
                      <div className="qty-control" style={{ height: '46px', width: '130px' }}>
                        <button
                          type="button"
                          onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                          disabled={cantidad <= 1}
                        >
                          -
                        </button>
                        <span>{cantidad}</span>
                        <button type="button" onClick={() => setCantidad(cantidad + 1)}>
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          flex: 1,
                          height: '46px',
                          backgroundColor: effectivePrimaryColor,
                        }}
                        onClick={() => {
                          setDemoCartCount((c) => c + cantidad);
                          triggerToast(
                            `✅ Se agregaron ${cantidad}x "${detalleProducto.nombre}" al carrito.`
                          );
                        }}
                      >
                        <ShoppingCart size={18} /> Agregar al Carrito
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn w-full"
                      style={{
                        height: '46px',
                        backgroundColor: '#25D366',
                        color: '#fff',
                        border: 'none',
                        marginTop: '0.5rem',
                      }}
                      onClick={() =>
                        triggerToast(
                          `💬 WhatsApp: "Hola, quiero pedir ${cantidad}x ${
                            detalleProducto.nombre
                          } - Total Bs ${
                            (detalleProducto.precioOferta || detalleProducto.precio) * cantidad
                          }"`
                        )
                      }
                    >
                      <MessageCircle size={18} /> Pedir directo por WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla comparativa rápida debajo del demo */}
      <div className="plan-demo-comparison-strip">
        <div className="comparison-strip-item">
          <span className="comparison-strip-label">Capacidad del catálogo</span>
          <strong>
            {activePlan === 'basico'
              ? 'Hasta 20 productos'
              : activePlan === 'avanzado'
              ? 'Hasta 40 productos'
              : 'Hasta 80 productos'}
          </strong>
        </div>
        <div className="comparison-strip-item">
          <span className="comparison-strip-label">Fotos por producto</span>
          <strong>
            {activePlan === 'profesional'
              ? 'Hasta 4 fotos con galería interactiva'
              : '1 foto principal'}
          </strong>
        </div>
        <div className="comparison-strip-item">
          <span className="comparison-strip-label">Diseño y Categorías</span>
          <strong>
            {activePlan === 'basico'
              ? 'Vista Simple minimalista'
              : 'Banners + Burbujas de Categorías + Color propio'}
          </strong>
        </div>
        <div className="comparison-strip-item">
          <span className="comparison-strip-label">Ficha de producto</span>
          <strong>
            {activePlan === 'profesional'
              ? 'Página de detalle completa + Carrito'
              : 'Compra directa desde el catálogo'}
          </strong>
        </div>
      </div>
    </div>
  );
}

/**
 * Página dedicada `/demo` para ver el comparador interactivo en pantalla completa
 */
export default function PlanDemoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramPlan = searchParams.get('plan') as PlanKey | null;
  const validPlan: PlanKey =
    paramPlan === 'basico' || paramPlan === 'avanzado' || paramPlan === 'profesional'
      ? paramPlan
      : 'avanzado';

  const handleSelectPlan = (plan: PlanKey) => {
    setSearchParams({ plan });
  };

  return (
    <div className="plan-demo-page">
      <header className="plan-demo-page-header">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="btn btn-secondary">
              <ArrowLeft size={16} /> Volver al inicio
            </Link>
            <div>
              <span className="logo-text" style={{ fontSize: '1.25rem' }}>
                micatalogo
              </span>
              <span className="plan-demo-page-badge">Demo Interactiva</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/register" className="btn btn-primary">
              Crear mi tienda ahora
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Explora cómo se verá tu tienda según tu plan
          </h1>
          <p className="text-muted">
            Cambia entre las 3 opciones, filtra categorías y haz clic en los productos para probar
            la experiencia real de tus clientes.
          </p>
        </div>

        <PlanDemoShowcase
          selectedPlan={validPlan}
          onSelectPlan={handleSelectPlan}
          fullPage={true}
        />
      </main>
    </div>
  );
}
