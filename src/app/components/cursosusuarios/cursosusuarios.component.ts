import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ListarcursosusuariosComponent } from './listarcursosusuarios/listarcursosusuarios.component';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cursosusuarios',
  standalone: true,
  imports: [
    RouterOutlet,
    ListarcursosusuariosComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './cursosusuarios.component.html',
  styleUrl: './cursosusuarios.component.css'
})
export class CursosusuariosComponent {
  constructor(public route: ActivatedRoute, private lS:LoginService) {}
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';
  

  verificar() {
    this.role = this.lS.showRole();
    return this.lS.verificar();
  }
  isAdmin() {
    return this.role === 'ADMINISTRADOR';
  }

  isStudent() {
    return this.role === 'ESTUDIANTE';
  }
}
