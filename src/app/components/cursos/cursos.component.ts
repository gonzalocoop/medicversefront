import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterModule } from '@angular/router';
import { ListarcursosComponent } from './listarcursos/listarcursos.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    RouterOutlet,
    ListarcursosComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css',
})
export class CursosComponent {
  constructor(public route: ActivatedRoute,private loginService: LoginService) {}
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }

  
  isAdmin() {
    return this.role === 'ADMINISTRADOR';
  }

  isStudent() {
    return this.role === 'ESTUDIANTE';
  }
}
