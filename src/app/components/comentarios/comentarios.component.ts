import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { ListarcomentariosComponent } from "./listarcomentarios/listarcomentarios.component";
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule,RouterModule,RouterOutlet, MatToolbarModule, MatMenuModule, MatIconModule, ListarcomentariosComponent,MatButtonModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
  constructor(public route: ActivatedRoute,private loginService: LoginService) {}
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';
  
  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }
}
