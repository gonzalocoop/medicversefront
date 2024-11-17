import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Suscripciones } from '../models/Suscripciones';

const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class SuscripcionService {

  private url=`${base_url}/suscripciones`
  private listaCambio=new Subject<Suscripciones[]>()
  constructor(private http:HttpClient) { }

  
 

  list(){
    return this.http.get<Suscripciones[]>(this.url)
  }

  //insert, get y set para el registrar
  insert(sus:Suscripciones){
    return this.http.post(this.url,sus);
  }
  //get y set
  getList(){
    return this.listaCambio.asObservable();
  }

  setList(listaNueva:Suscripciones[]){
    this.listaCambio.next(listaNueva); 
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<Suscripciones>(`${this.url}/${id}`)
  }
  update(d:Suscripciones){
    return this.http.put(this.url,d)
  }

}
