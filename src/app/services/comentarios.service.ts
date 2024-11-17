import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable, Subject } from "rxjs";
import { Comentarios } from "../models/Comentarios";
import { HttpClient } from "@angular/common/http";
import { CursoCantComentariosDTO } from "../models/CursoCantComentariosDTO";
import { LoginService } from "./login.service";

const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  private url=`${base_url}/comentarios`
  private listaCambio=new Subject<Comentarios[]>()
  constructor(private http:HttpClient, private loginService: LoginService) { }

  list(){
    return this.http.get<Comentarios[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(co:Comentarios){
    return this.http.post(this.url,co);
  }
  //get y set
  getList(){
    return this.listaCambio.asObservable();
  }

  setList(listaNueva: Comentarios[]) {
    const role = this.loginService.showRole();  // Obtener el rol del usuario
    const username = localStorage.getItem("username") ?? "";  // Obtener el nombre de usuario
  
    if (role === 'ADMINISTRADOR') {
      // Si es admin, pasar todos los videos favoritos
      this.listaCambio.next(listaNueva);
    } else {
      // Si no es admin, filtrar solo los videos del usuario actual
      const filteredList = listaNueva.filter(coment => coment.usua.username === username);
      this.listaCambio.next(filteredList);
    }
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<Comentarios>(`${this.url}/${id}`)
  }
  update(d:Comentarios){
    return this.http.put(this.url,d)
  }

  // Función para buscar sesiones por título
  listPorSesion(titulo: string): Observable<any> {
    // Asegúrate de codificar el título para que sea seguro para la URL
    const encodedTitulo = encodeURIComponent(titulo);
    const urll = `${this.url}/sesiontitulocomentario?tituloSesion=${encodedTitulo}`;
    return this.http.get(urll);
  }

  top3Cursos():Observable<CursoCantComentariosDTO[]>{
    return this.http.get<CursoCantComentariosDTO[]>(`${this.url}/top3cursosmascomentarios`);
  }

  listarMalosComentarios(titulo: string): Observable<Comentarios[]> {
    // Asegúrate de codificar el título para que sea seguro para la URL
    const encodedTitulo = encodeURIComponent(titulo);
    const urll = `${this.url}/listarmaloscomentarios?titulo=${encodedTitulo}`;
    return this.http.get<Comentarios[]>(urll);
  }

  comentarioPorusuario(username: string): Observable<Comentarios[]> {
    
    const encodedUsername = encodeURIComponent(username);
    const urll = `${this.url}/buscarcomentariousername?username=${encodedUsername}`;
    return this.http.get<Comentarios[]>(urll);
  }
}
