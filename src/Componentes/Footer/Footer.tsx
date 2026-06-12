import React from "react";
import type { ConfigWeb } from "../../Models/ConfigWeb";
import "./Footer.css";

interface FooterProps {
  
  configWeb: ConfigWeb;
 
}
const Footer: React.FC<FooterProps> = ({
 
  configWeb,

}) => {

     const handleClick = () => {
   
    // Siempre hacemos scroll al top
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Para un desplazamiento suave
    });
  };

  return (
    <>
      <footer
        style={{
          backgroundColor: configWeb.colorFondoNav,
          color: configWeb.colorNav,
        }}
      >
        <div className="contenidoFooter">
          <div style={{ display: "flex", height: "100%" }}>
            <div className="logo">
              <img src={configWeb.logo} alt="" />
            </div>
            <div className="textoFooter">
              <div className="titulo">SIGUENOS EN:</div>
              <div className="redes">
                <div className="red"></div>
                <div className="red"></div>
                <div className="red"></div>
              </div>
            </div>
          </div>
          <div className="botonArriba" onClick={handleClick}>
            ^
          </div>
        </div>
      </footer>

    </>
  );
};

export default Footer;
