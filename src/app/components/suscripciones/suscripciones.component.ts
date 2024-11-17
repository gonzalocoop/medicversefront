import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { ListarsuscripcionesComponent } from './listarsuscripciones/listarsuscripciones.component';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suscripciones',
  standalone: true,
  imports: [CommonModule,RouterOutlet,ListarsuscripcionesComponent,RouterModule,MatToolbarModule,MatIconModule,MatMenuModule,MatButtonModule],
  templateUrl: './suscripciones.component.html',
  styleUrl: './suscripciones.component.css'
})
export class SuscripcionesComponent {
  constructor(public route: ActivatedRoute,private loginService: LoginService) {}
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }
}
