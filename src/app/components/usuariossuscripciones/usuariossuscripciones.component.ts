import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ListarusuariossuscripcionesComponent } from "./listarusuariossuscripciones/listarusuariossuscripciones.component";
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuariossuscripciones',
  standalone: true,
  imports: [
    RouterOutlet,
    ListarusuariossuscripcionesComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './usuariossuscripciones.component.html',
  styleUrl: './usuariossuscripciones.component.css'
})
export class UsuariossuscripcionesComponent {
  constructor(public route: ActivatedRoute,private loginService: LoginService) {}
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }

}
