import React from 'react'

import "./Card.css"
import type { Producto } from '../../Models/Producto';


interface CardProps {
  producto: Producto;
  onClickCard?: (producto: Producto) => void;
};
const Card: React.FC<CardProps> = ({ producto,onClickCard }) => {
    return(
      <>
     
     <div className="card" onClick={() => onClickCard && onClickCard(producto)}>
       <div className="img">
        <img src={producto.imagenes} alt="" />
       </div>
       <div className="contenidoCard">
        <div className="estado">
           {producto.nuevo && (<div className="nuevo">NUEVO</div>)}
           {producto.oferta && (<div className="oferta">OFERTA</div>)}

        </div>
        <div className="nombre">
          {producto.nombre}
        </div>
        <div className="precio">
          Bs {producto.precio} 
        </div>
       </div>
     </div>

     </>
    );

}
export default Card
