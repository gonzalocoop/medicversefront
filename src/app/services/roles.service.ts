import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Roles } from '../models/Roles';

const base_url=environment.base

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private url=`${base_url}/roles`
  private listaCambio=new Subject<Roles[]>()
  constructor(private http:HttpClient) { }

  list(){
    return this.http.get<Roles[]>(this.url);
  }

  insert(ro:Roles){
    return this.http.post<Roles>(this.url,ro);
  }

  getList(){
    return this.listaCambio.asObservable();
  }

  setList(listaNueva:Roles[]){
    this.listaCambio.next(listaNueva);
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`);
  }

  listId(id:number){
    return this.http.get<Roles>(`${this.url}/${id}`)
  }

  update(d:Roles){
    return this.http.put(this.url, d)
  }
}
