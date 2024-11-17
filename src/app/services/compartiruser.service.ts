import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuarios } from '../models/Usuarios';

@Injectable({
  providedIn: 'root'
})
export class CompartiruserService {

  private selectedUser = new BehaviorSubject<Usuarios | null>(null);

  // Observable para obtener la selección actual
  selectedUser$ = this.selectedUser.asObservable();

  // Método para establecer el usuario seleccionado
  setSelectedUser(user: Usuarios) {
    this.selectedUser.next(user);
  }
}
