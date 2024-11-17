import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Cronogramas } from '../models/Cronogramas';
import { LoginService } from './login.service';

const base_url=environment.base


@Injectable({
  providedIn: 'root'
})
export class CronogramasService {

  private url=`${base_url}/cronogramas`
  private listaCambio=new Subject<Cronogramas[]>()
  constructor(private http:HttpClient, private loginService: LoginService) { }

  list(){
    return this.http.get<Cronogramas[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(c:Cronogramas){
    return this.http.post(this.url,c);
  }
  //get y set
  getList(){
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Cronogramas[]) {
    const role = this.loginService.showRole();  // Obtener el rol del usuario
    const username = localStorage.getItem("username") ?? "";  // Obtener el nombre de usuario
  
    if (role === 'ADMINISTRADOR') {
      // Si es admin, pasar todos los videos favoritos
      this.listaCambio.next(listaNueva);
    } else {
      // Si no es admin, filtrar solo los videos del usuario actual
      const filteredList = listaNueva.filter(crono => crono.curUsu.usua.username === username);
      this.listaCambio.next(filteredList);
    }
  }

  

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<Cronogramas>(`${this.url}/${id}`)
  }
  update(c:Cronogramas){
    return this.http.put(this.url,c)
  }

  generar( idCursoUsuario:number){
    const urll = `${this.url}/generar?idCursoUsuario=${idCursoUsuario}`;
    return this.http.post(urll,null);
  }

  actualizarEstadoCronogramas(idSesion: number, idCursoUsuario: number) {
    const urll = `${this.url}/actualizarestado?idSesion=${idSesion}&idCursoUsuario=${idCursoUsuario}`;
    return this.http.put(urll, null);
  }

  cronogramaPorusuario(username: string): Observable<Cronogramas[]> {
    
    const encodedUsername = encodeURIComponent(username);
    const urll = `${this.url}/buscarcronogramaxusernameusuario?username=${encodedUsername}`;
    return this.http.get<Cronogramas[]>(urll);
  }
}
