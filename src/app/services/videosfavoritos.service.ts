import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { VideosFavoritos } from "../models/VideosFavoritos";
import { LoginService } from "./login.service";


const base_url=environment.base


@Injectable({
  providedIn: 'root'
})
export class VideosFavoritosService {

    private url=`${base_url}/videosfavoritos`
    private listaCambio=new Subject<VideosFavoritos[]>()
    constructor(private http:HttpClient, private loginService: LoginService) { }
  
    list(){
      return this.http.get<VideosFavoritos[]>(this.url)
    }
  
    //insert, get y set para el registrar
    insert(fS:VideosFavoritos){
      return this.http.post(this.url,fS);
    }
    //get y set
    getList(){
      return this.listaCambio.asObservable();
    }
  
    setList(listaNueva: VideosFavoritos[]) {
      const role = this.loginService.showRole();  // Obtener el rol del usuario
      const username = localStorage.getItem("username") ?? "";  // Obtener el nombre de usuario
    
      if (role === 'ADMINISTRADOR') {
        // Si es admin, pasar todos los videos favoritos
        this.listaCambio.next(listaNueva);
      } else {
        // Si no es admin, filtrar solo los videos del usuario actual
        const filteredList = listaNueva.filter(video => video.usu.username === username);
        this.listaCambio.next(filteredList);
      }
    }
  
    delete(id:number){
      return this.http.delete(`${this.url}/${id}`);
    }
  
    listId(id:number){
      return this.http.get<VideosFavoritos>(`${this.url}/${id}`)
    }
    update(fS:VideosFavoritos){
      return this.http.put(this.url,fS)
    }

    listPorUsuario(username: string): Observable<any> {
      // Asegúrate de codificar el título para que sea seguro para la URL
      const encodedUsername = encodeURIComponent(username);
      const urll = `${this.url}/buscarusuariovideofav?u=${encodedUsername}`;
      return this.http.get(urll);
    }
  }
  