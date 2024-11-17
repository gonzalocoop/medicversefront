import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CursosUsuarios } from '../models/CursosUsuarios';
import { CantCursCompleNoCompleDTO } from '../models/CantCursCompleNoCompleDTO';
import { LoginService } from './login.service';
import { CantidadGeneralCursosUsuariosDTO } from '../models/CantidadGeneralCursosUsuariosDTO';

const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class CursosUsuariosService {

  private url=`${base_url}/cursoscsuarios`
  private listaCambio=new Subject<CursosUsuarios[]>()
  constructor(private http:HttpClient, private loginService: LoginService) { }

  list(){
    return this.http.get<CursosUsuarios[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(cu:CursosUsuarios){
    return this.http.post(this.url,cu);
  }
  //get y set
  getList(){
    return this.listaCambio.asObservable();
  }


  setList(listaNueva: CursosUsuarios[]) {
    const role = this.loginService.showRole();  // Obtener el rol del usuario
    const username = localStorage.getItem("username") ?? "";  // Obtener el nombre de usuario
  
    if (role === 'ADMINISTRADOR') {
      // Si es admin, pasar todos los videos favoritos
      this.listaCambio.next(listaNueva);
    } else {
      // Si no es admin, filtrar solo los videos del usuario actual
      const filteredList = listaNueva.filter(curusu => curusu.usua.username === username);
      this.listaCambio.next(filteredList);
    }
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<CursosUsuarios>(`${this.url}/${id}`)
  }
  update(cu:CursosUsuarios){
    return this.http.put(this.url,cu)
  }

 // Nueva función para registrar un usuario en un curso usando parámetros de consulta
  registrarUsuarioEnCurso(idCurso: number, idUsuario: number) {
  // Construir la URL con los parámetros de consulta
  const urll = `${this.url}/registrarcurso?idCurso=${idCurso}&idUsuario=${idUsuario}`;
  return this.http.post(urll, null); // Se envía null porque no hay cuerpo en la solicitud
    
  }

  listSegunUsuarioYCurso(idCurso: number, idUsuario: number){
    const urll = `${this.url}/listarseguncursousuario?idCurso=${idCurso}&idUsuario=${idUsuario}`;
    return this.http.get<CursosUsuarios>(`${urll}`)
  }

  // Función para actualizar el progreso y el estado del curso usuario
  actualizarProgresoYEstadoCursoUsuario(idCursoUsuario: number) {
    const urll = `${this.url}/actualizarprogreso?idCursoUsuario=${idCursoUsuario}`;
    return this.http.put(urll, null);
  }

  cantidadCursosCompletadosYNoCompletados():Observable<CantCursCompleNoCompleDTO[]>{
    return this.http.get<CantCursCompleNoCompleDTO[]>(`${this.url}/cantidaddecursoscompletadosynocompletados`);
  }
  

  cursousuarioPorusuario(username: string): Observable<CursosUsuarios[]> {
    
    const encodedUsername = encodeURIComponent(username);
    const urll = `${this.url}/buscarcursosusuariosporusuario?username=${encodedUsername}`;
    return this.http.get<CursosUsuarios[]>(urll);
  }

  cantidadTotaCursosCompletadosYNo():Observable<CantidadGeneralCursosUsuariosDTO[]>{
    return this.http.get<CantidadGeneralCursosUsuariosDTO[]>(`${this.url}/cantidadtotalcursosUsuarioscompletadoyno`);
  }
}
