import { Roles } from "./Roles"

export class Usuarios{
    id:number=0   
    username:string=""
    password:string=""
    email:string=""
    activo:boolean=true
    rol:Roles=new Roles()
}