import { CursosUsuarios } from "./CursosUsuarios"
import { Sesiones } from "./Sesiones"

export class Cronogramas{
    id:number=0   
    detalle:string=""
    fechaLimite:Date=new Date(Date.now())
    estado:string=""
    curUsu:CursosUsuarios=new CursosUsuarios()
    ses:Sesiones=new Sesiones()
}