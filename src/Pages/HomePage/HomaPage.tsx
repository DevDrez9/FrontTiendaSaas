import React from "react";
import type { Producto } from "../../Models/Producto";
import type { Banner } from "../../Models/Banner";
import BannerCarusel from "../../Componentes/Banner/BannerCarusel";
import CaruselCard from "../../Componentes/CaruselCard/CaruselCard";


interface HomePageProps {
  banners: Banner[];
  productos: Producto[];
  onClickCard?: (producto: Producto) => void;
  
}

const HomePage: React.FC<HomePageProps> = ({ banners, productos, onClickCard  }) => {
    return(
        <>
         <BannerCarusel banners={banners} />
        <CaruselCard productos={productos} titulo="Ofertas" onClickCard={onClickCard}/>
        <CaruselCard productos={productos} titulo="Destacados" onClickCard={onClickCard} />

        </>
    )

}
export default HomePage