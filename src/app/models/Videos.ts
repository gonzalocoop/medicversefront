import { Sesiones } from "./Sesiones"

export class Videos{
    id:number=0   
    titulo:string=""
    fechaAgregado:Date=new Date(Date.now())
    duracion:number=0
    url:string=""
    ses:Sesiones=new Sesiones()
}