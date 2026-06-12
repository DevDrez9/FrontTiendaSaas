// En un archivo llamado, por ejemplo, Producto.ts o models/Producto.ts

/**
 * @interface IProducto
 * @description Interfaz que define la estructura de un producto.
 */
export interface IProducto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string; // Considerar cambiar a 'number' si vas a hacer operaciones matemáticas con él
  oferta: boolean;
  nuevo: boolean;
  marca: string;
  categoria: number;
  subCategoria: number;
  imagenes:string;
  // Podrías añadir una propiedad para la URL de la imagen si tus productos la tienen
  // imagenUrl?: string;
}

/**
 * @class Producto
 * @implements IProducto
 * @description Clase que implementa la interfaz IProducto y representa un producto.
 */
export class Producto implements IProducto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string; // Vuelvo a sugerir 'number' si es para cálculos
  oferta: boolean;
  nuevo: boolean;
  marca: string;
  categoria: number;
  subCategoria: number;
  imagenes: string
  // imagenUrl?: string; // Si decides añadirlo en la interfaz, también aquí

  constructor(
    id: number,
    nombre: string,
    descripcion: string,
    precio: string, // Considerar 'number'
    oferta: boolean,
    nuevo: boolean,
    marca: string,
    categoria: number,
    subCategoria: number,
    imagenes:string
    // imagenUrl?: string // Si lo añades, también aquí
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.oferta = oferta;
    this.nuevo = nuevo;
    this.marca = marca;
    this.categoria = categoria;
    this.subCategoria = subCategoria;
    this.imagenes=imagenes
    // this.imagenUrl = imagenUrl; // Asignación si lo añades
  }

  // Puedes añadir métodos a la clase Producto si necesitas lógica de negocio
  // Por ejemplo:
  // getPrecioNumerico(): number {
  //   return parseFloat(this.precio);
  // }
}