import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { PlanDemoShowcase, type PlanKey } from "../Demo/PlanDemoShowcase";
import "./LandingPage.css";

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [demoPlan, setDemoPlan] = useState<PlanKey>("avanzado");

  const verDemoDePlan = (plan: PlanKey) => {
    setDemoPlan(plan);
    const el = document.getElementById("demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-wrapper">
      <header className="landing-header">
        <div className="container landing-header-inner">
          <div className="logo-text">micatalogo</div>
          <div className="flex items-center gap-4">
            <a href="#demo" className="btn btn-secondary">
              <Eye size={16} /> Ver Demos
            </a>
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg-glow"></div>
          <div className="container hero-content animate-slide-up">
            <h1 className="hero-title">
              Crea tu tienda en línea en <span className="hero-title-highlight">minutos</span>
            </h1>
            <p className="hero-subtitle">
              Gestiona tus productos, categorías y ventas desde un panel de control intuitivo.
              Elige el plan que mejor se adapte a ti.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Comenzar Gratis
              </Link>
              <a href="#demo" className="btn btn-secondary">
                <Eye size={16} /> Probar Demo de Tiendas
              </a>
              <a href="#pricing" className="btn btn-secondary">
                Ver Planes
              </a>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing-section">
          <div className="container">
            <h2 className="section-title">Planes Simples y Transparentes</h2>
            
            <div className="pricing-toggle-container">
              <div className="pricing-toggle">
                <button 
                  className={!isAnnual ? 'active' : ''}
                  onClick={() => setIsAnnual(false)}
                >
                  Mensual
                </button>
                <button 
                  className={isAnnual ? 'active-primary' : ''}
                  onClick={() => setIsAnnual(true)}
                >
                  Anual <span className="text-sm font-normal ml-1">(2 meses gratis)</span>
                </button>
              </div>
            </div>
            
            <div className="pricing-grid">
              {/* Basic Plan */}
              <div className="card pricing-card animate-slide-up">
                <h3 className="card-title">Plan Básico</h3>
                <p className="card-desc">Ideal para pequeños comercios que necesitan un catálogo simple.</p>
                <div className="price-tag">
                  Bs{isAnnual ? '99.90' : '9.99'}<span>/{isAnnual ? 'año' : 'mes'}</span>
                </div>
                
                <ul className="features-list">
                  <li>Límite de 20 productos</li>
                  <li>1 imagen por producto</li>
                  <li>Gestión de inventario</li>
                </ul>
                
                <div className="pricing-card-actions">
                  <Link to="/register" className="btn btn-secondary w-full">
                    Empezar Básico
                  </Link>
                  <button
                    type="button"
                    className="btn-preview-plan"
                    onClick={() => verDemoDePlan("basico")}
                  >
                    <Eye size={15} /> Ver cómo se ve tu tienda
                  </button>
                </div>
              </div>

              {/* Advanced Plan */}
              <div className="card pricing-card recommended animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="pricing-badge">RECOMENDADO</div>
                <h3 className="card-title">Plan Avanzado</h3>
                <p className="card-desc">Para negocios que buscan una experiencia de compra completa.</p>
                <div className="price-tag">
                  Bs{isAnnual ? '299.90' : '29.99'}<span>/{isAnnual ? 'año' : 'mes'}</span>
                </div>
                
                <ul className="features-list">
                  <li>Límite de 40 productos</li>
                  <li>1 imagen por producto</li>
                  <li>Tienda con diseño completo y categorías</li>
                  <li>Banners promocionales</li>
                </ul>
                
                <div className="pricing-card-actions">
                  <Link to="/register" className="btn btn-primary w-full">
                    Empezar Avanzado
                  </Link>
                  <button
                    type="button"
                    className="btn-preview-plan"
                    onClick={() => verDemoDePlan("avanzado")}
                  >
                    <Eye size={15} /> Ver cómo se ve tu tienda
                  </button>
                </div>
              </div>

              {/* Profesional Plan */}
              <div className="card pricing-card animate-slide-up" style={{ animationDelay: '200ms' }}>
                <h3 className="card-title">Plan Profesional</h3>
                <p className="card-desc">Para marcas que necesitan mayor catálogo y mejor presentación visual.</p>
                <div className="price-tag">
                  Bs{isAnnual ? '599.90' : '59.99'}<span>/{isAnnual ? 'año' : 'mes'}</span>
                </div>
                
                <ul className="features-list">
                  <li>Todo lo del Plan Avanzado</li>
                  <li>Catálogo expandido (Hasta 80 productos)</li>
                  <li>Múltiples imágenes (Max 4 por producto)</li>
                  <li>Página de detalle interactiva de productos</li>
                </ul>
                
                <div className="pricing-card-actions">
                  <Link to="/register" className="btn btn-secondary w-full">
                    Empezar Profesional
                  </Link>
                  <button
                    type="button"
                    className="btn-preview-plan"
                    onClick={() => verDemoDePlan("profesional")}
                  >
                    <Eye size={15} /> Ver cómo se ve tu tienda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Storefront Demo Section */}
        <section id="demo" className="demo-showcase-section">
          <div className="container">
            <div className="demo-section-header">
              <span className="demo-section-pill">VISTA PREVIA INTERACTIVA</span>
              <h2 className="section-title" style={{ marginBottom: "0.75rem" }}>
                Mira cómo se verá tu tienda según el plan que elijas
              </h2>
              <p className="demo-section-subtitle">
                Interactúa con los 3 diseños en tiempo real: prueba el catálogo simple del{" "}
                <strong>Plan Básico</strong>, los banners y categorías del{" "}
                <strong>Plan Avanzado</strong> o haz clic en un producto en el{" "}
                <strong>Plan Profesional</strong> para ver su galería de hasta 4 fotos.
              </p>
            </div>

            <PlanDemoShowcase selectedPlan={demoPlan} onSelectPlan={setDemoPlan} />
          </div>
        </section>
      </main>
    </div>
  );
}
