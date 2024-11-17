import { Cursos } from "./Cursos"
import { Usuarios } from "./Usuarios"

export class CursosUsuarios{
    id:number=0   
    progreso:number=0 
    fechaInicio:Date=new Date(Date.now())
    fechaFin:Date=new Date(Date.now())
    estado:string=""
    url:string=""
    cur:Cursos=new Cursos()
    usua:Usuarios=new Usuarios()
}