import React, { useEffect, useState } from "react";
import type { Categoria } from "../../Models/Categoria";
import "./Nav.css";
import type { ConfigWeb } from "../../Models/ConfigWeb";

interface NavProps {
  categorias: Categoria[];
  configWeb:ConfigWeb
  onClickNav: (categoriaa: Categoria) => void;
}

const Nav: React.FC<NavProps> = ({ categorias, configWeb ,onClickNav }) => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Verificamos si estamos en la parte superior de la página
      const atTop = window.scrollY < 50; // Ajusta este valor según necesites
      setIsAtTop(atTop);
    };

    // Agregamos el event listener cuando el componente se monta
    window.addEventListener("scroll", handleScroll);

    // Limpiamos el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`nav ${isAtTop ? "visible" : "hidden"}`} style={{backgroundColor:configWeb.colorFondoNav}} >
        <div className="contenido">
          <img src="src/assets/logo.png" alt="" />
          <div className="opciones">
            {categorias.map((categoria) => (
              <div

               style={{color:configWeb.colorNav}} 
                key={categoria.id}
                className="opcion"
                onClick={() => onClickNav(categoria)}
              >
                {categoria.nombre}
              </div>
            ))}
          </div>

          <div className="carrito"></div>
        </div>
      </div>
      <div className={`subNav ${!isAtTop ? "visible" : "hidden"}`}  style={{backgroundColor:configWeb.colorNav}} >
        {/* Contenido de tu sub navegación */}
        Sub navegación
      </div>
    </>
  );
};

export default Nav;
