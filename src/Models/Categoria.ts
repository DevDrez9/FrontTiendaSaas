import type { SubCategorias } from "./SubCategoria"

export class Categoria{
    nombre:string
    id:number

    subCategorias?:SubCategorias[]
}