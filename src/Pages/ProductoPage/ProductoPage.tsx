import React from "react";
import type { Producto } from "../../Models/Producto";
import "./ProductoPage.css"

interface ProductoPageProps {
  producto: Producto;
  onClickCard?: (producto: Producto) => void;
}
const ProductoPage: React.FC<ProductoPageProps> = ({ producto }) => {
  return <>
    <div className="productoPage">
        <div className="imagenes">

        </div>
        <div className="contenidoProducto">
            <h2>{producto.nombre}</h2>
        </div>
    </div>
  </>;
};
export default ProductoPage;
