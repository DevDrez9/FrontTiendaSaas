import React, { useEffect, useRef, useState } from 'react'
import type { Banner } from '../../Models/Banner';
import "./BannerCarusel.css"

interface BannerCarouselProps {
  banners: Banner[];
  intervalo?: number;
}

const BannerCarusel: React.FC<BannerCarouselProps> = ({ 
  banners, 
  intervalo = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Efecto para el auto-play
  useEffect(() => {
    if (!isPaused && banners.length > 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % banners.length);
      }, intervalo);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [banners.length, intervalo, isPaused]);

  // Navegación manual
  const goTo = (index: number) => {
    setCurrentIndex(index);
    resetInterval();
  };

  const goToNext = () => goTo((currentIndex + 1) % banners.length);
  const goToPrev = () => goTo((currentIndex - 1 + banners.length) % banners.length);

  const resetInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, intervalo);
  };

  return (
    <div 
      className="banner-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Contenedor principal */}
      <div className="banner-track">
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
            aria-hidden={index !== currentIndex}
          >
            {banner.enlace ? (
              <a href={banner.enlace} className="banner-link">
                <img 
                  src={banner.imagen} 
                  alt={banner.altText || ''}
                  className="banner-image"
                  loading="lazy"
                />
              </a>
            ) : (
              <img 
                src={banner.imagen} 
                alt={banner.altText || ''}
                className="banner-image"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      {banners.length > 1 && (
        <>
          <button 
            className="banner-nav prev"
            onClick={goToPrev}
            aria-label="Banner anterior"
          >
            &lt;
          </button>
          <button 
            className="banner-nav next"
            onClick={goToNext}
            aria-label="Banner siguiente"
          >
            &gt;
          </button>

          {/* Indicadores */}
          <div className="banner-indicators">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goTo(index)}
                aria-label={`Ir al banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarusel;