import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ListarsesionesComponent } from './listarsesiones/listarsesiones.component';
import { ListarvideosComponent } from "../videos/listarvideos/listarvideos.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-sesiones',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ListarsesionesComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    ListarvideosComponent
],
  templateUrl: './sesiones.component.html',
  styleUrl: './sesiones.component.css'
})
export class SesionesComponent {
  constructor(public route: ActivatedRoute,private loginService: LoginService) {}
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }

}
