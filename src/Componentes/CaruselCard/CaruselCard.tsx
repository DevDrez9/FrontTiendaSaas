import React, { useState, useEffect, useRef } from "react";
import type { Producto } from "../../Models/Producto";
import Card from "../Card/Card.tsx";
import "./CaruselCard.css";

interface CaruselCardProps {
  productos: Producto[];
  titulo:string
   onClickCard?: (producto: Producto) => void;
}

const CaruselCard: React.FC<CaruselCardProps> = ({ productos, titulo, onClickCard }) => {
   const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Duplicamos los productos para el efecto infinito
  const duplicatedProducts = [...productos, ...productos];

  // Configuración del auto-scroll
  useEffect(() => {
    if (!isPaused && productos.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % productos.length);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [productos.length, isPaused]);

  // Navegación manual
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % productos.length);
    resetInterval();
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + productos.length) % productos.length);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % productos.length);
    }, 3000);
  };

  // Calculamos el desplazamiento
  const getTransform = () => {
    const cardWidth = 300; // Ajustar según tu CSS
    return `translateX(-${currentIndex * cardWidth}px)`;
  };

  return (
    <>

    
     <div className="tituloCard">
        <h2>{titulo}</h2>
      </div>
    <div 
      className="carusel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button 
        className="carusel-button prev"
        onClick={goToPrev}
        aria-label="Anterior"
      >
        &lt;
      </button>

      <div 
        ref={carouselRef}
        className="carusel-track"
        style={{
          transform: getTransform(),
          transition: 'transform 0.5s ease'
        }}
      >
        {duplicatedProducts.map((producto, index) => (
          <div key={`${producto.id}-${index}`} className="carusel-card">
            <Card 
              onClickCard={onClickCard}
              producto={producto}
            />
          </div>
        ))}
      </div>

      <button 
        className="carusel-button next"
        onClick={goToNext}
        aria-label="Siguiente"
      >
        &gt;
      </button>
    </div>
    </>
  );
};

export default CaruselCard;
