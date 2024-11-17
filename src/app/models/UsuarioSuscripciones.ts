import { Suscripciones } from "./Suscripciones"
import { Usuarios } from "./Usuarios"

export class UsuarioSuscripciones{
    id:number=0   
    
    fechaInicio:Date=new Date(Date.now())
    fechaFin:Date=new Date(Date.now())
   
    sus:Suscripciones=new Suscripciones()
    usu:Usuarios=new Usuarios()
}