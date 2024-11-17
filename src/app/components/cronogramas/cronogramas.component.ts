import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ListarcronogramasComponent } from './listarcronogramas/listarcronogramas.component';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-cronogramas',
  standalone: true,
  imports: [
    RouterOutlet,
    ListarcronogramasComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './cronogramas.component.html',
  styleUrl: './cronogramas.component.css'
})
export class CronogramasComponent {
  selectedUser: string = localStorage.getItem("username") ?? "";
  constructor(public route: ActivatedRoute,private lS: LoginService) {}
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
