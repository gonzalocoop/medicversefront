import { Sesiones } from "./Sesiones"
import { Usuarios } from "./Usuarios"

export class Comentarios{
    id:number=0   
    comentario:string=""
    fecha:Date=new Date(Date.now())
    usua:Usuarios=new Usuarios()
    ses:Sesiones=new Sesiones()
}