import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ListarvideosfavoritosComponent } from "./listarvideosfavoritos/listarvideosfavoritos.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-videosfavoritos',
  standalone: true,
  imports: [
    RouterOutlet,
    ListarvideosfavoritosComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './videosfavoritos.component.html',
  styleUrl: './videosfavoritos.component.css'
})
export class VideosfavoritosComponent {
  constructor(public route: ActivatedRoute,private loginService: LoginService) {}
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }


}
