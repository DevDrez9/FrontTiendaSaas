import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <header className="landing-header">
        <div className="container landing-header-inner">
          <div className="logo-text">micatalogo</div>
          <Link to="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
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
            
            <div className="pricing-grid">
              {/* Basic Plan */}
              <div className="card pricing-card animate-slide-up">
                <h3 className="card-title">Plan Básico</h3>
                <p className="card-desc">Ideal para pequeños comercios que necesitan un catálogo simple.</p>
                <div className="price-tag">Bs9.99<span>/mes</span></div>
                
                <ul className="features-list">
                  <li>Vista simplificada de productos</li>
                  <li>Gestión de inventario</li>
                  <li>Soporte por email</li>
                </ul>
                
                <Link to="/register" className="btn btn-secondary w-full">
                  Empezar Básico
                </Link>
              </div>

              {/* Advanced Plan */}
              <div className="card pricing-card recommended animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="pricing-badge">RECOMENDADO</div>
                <h3 className="card-title">Plan Avanzado</h3>
                <p className="card-desc">Para negocios que buscan una experiencia de compra completa.</p>
                <div className="price-tag">Bs29.99<span>/mes</span></div>
                
                <ul className="features-list">
                  <li>Tienda con diseño completo</li>
                  <li>Banners promocionales</li>
                  <li>Múltiples categorías y navegación</li>
                  <li>Soporte prioritario 24/7</li>
                </ul>
                
                <Link to="/register" className="btn btn-primary w-full">
                  Empezar Avanzado
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
