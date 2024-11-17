import { Injectable } from '@angular/core';
import { UsuarioSuscripciones } from '../models/UsuarioSuscripciones';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsuariosTipoSuscripcionDTO } from '../models/UsuariosTipoSuscripcionDTO';
import { RecaudacionSuscripcionDTO } from '../models/RecaudacionSuscripcionDTO';
import { LoginService } from './login.service';

const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class UsuarioSuscripcionesService {

  private url=`${base_url}/usuariossuscripciones`
  private listaCambio=new Subject<UsuarioSuscripciones[]>()
  constructor(private http:HttpClient, private loginService: LoginService) { }


  list(){
    return this.http.get<UsuarioSuscripciones[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(us:UsuarioSuscripciones){
    return this.http.post(this.url,us);
  }
  //get y set
  getList(){
    return this.listaCambio.asObservable();
  }
 // this.listaCambio.next(listaNueva); 

  setList(listaNueva:UsuarioSuscripciones[]){
    const role = this.loginService.showRole();  // Obtener el rol del usuario
      const username = localStorage.getItem("username") ?? "";  // Obtener el nombre de usuario
    
      if (role === 'ADMINISTRADOR') {
        this.listaCambio.next(listaNueva);
      } else {
        const filteredList = listaNueva.filter(usuariosusc => usuariosusc.usu.username === username);
        this.listaCambio.next(filteredList);
      }
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<UsuarioSuscripciones>(`${this.url}/${id}`)
  }
  update(us:UsuarioSuscripciones){
    return this.http.put(this.url,us)
  }

  usuariosTipoSuscripcion(suscripcion: string): Observable<UsuariosTipoSuscripcionDTO[]> {
    const encodedSuscripcion = encodeURIComponent(suscripcion);
    const urll = `${this.url}/usuariostiposuscripcion?s=${encodedSuscripcion}`;
    return this.http.get<UsuariosTipoSuscripcionDTO[]>(urll);
  }
  recaudacionSuscripciones(suscripcion: string, fechaI: Date, fechaF: Date): Observable<RecaudacionSuscripcionDTO[]> {
    const encodedSuscripcion = encodeURIComponent(suscripcion);
    const fechaInicio = fechaI.toISOString().split('T')[0]; // Convierte la fecha a 'YYYY-MM-DD'
    const fechaFin = fechaF.toISOString().split('T')[0]; // Convierte la fecha a 'YYYY-MM-DD'
    const urll = `${this.url}/recaudacion?nombreSuscripcion=${encodedSuscripcion}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    return this.http.get<RecaudacionSuscripcionDTO[]>(urll);
}

  listPorUsuario(username: string): Observable<any> {
  // Asegúrate de codificar el título para que sea seguro para la URL
  const encodedUsername = encodeURIComponent(username);
  const urll = `${this.url}/buscarusuariosuscripcion?username=${encodedUsername}`;
  return this.http.get(urll);
}
}
