import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Sesiones } from '../models/Sesiones';
import { PromedioVideosDTO } from '../models/PromedioVideosDTO';
import { SesionCantidadVideoDTO } from '../models/SesionCantidadVideoDTO';

const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class SesionesService {

  private url=`${base_url}/sesiones`
  private listaCambio=new Subject<Sesiones[]>()
  constructor(private http:HttpClient) { }

  list(){
    return this.http.get<Sesiones[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(cu:Sesiones){
    return this.http.post(this.url,cu);
  }
  //get y set
  getList(){
    return this.listaCambio.asObservable();
  }

  setList(listaNueva:Sesiones[]){
    this.listaCambio.next(listaNueva); 
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<Sesiones>(`${this.url}/${id}`)
  }
  update(d:Sesiones){
    return this.http.put(this.url,d)
  }

  // Función para buscar sesiones por título
  listPorCurso(titulo: string): Observable<any> {
    // Asegúrate de codificar el título para que sea seguro para la URL
    const encodedTitulo = encodeURIComponent(titulo);
    const urll = `${this.url}/buscarsesionesporcurso?c=${encodedTitulo}`;
    return this.http.get(urll);
  }

  tiempoPromedio():Observable<PromedioVideosDTO[]>{
    return this.http.get<PromedioVideosDTO[]>(`${this.url}/promediovideos`);
  }

  tituloDuracionVideos():Observable<SesionCantidadVideoDTO[]>{
    return this.http.get<SesionCantidadVideoDTO[]>(`${this.url}/sesionvideoduracion`);
  }
  
}
