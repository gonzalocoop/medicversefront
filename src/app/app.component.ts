import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CursosComponent } from './components/cursos/cursos.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LoginService } from './services/login.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule, CursosComponent, VideoPlayerComponent,MatToolbarModule,MatIconModule, MatMenuModule, MatButtonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FrontEnd_SI62_G5';

  role: string = '';
  constructor(private lS: LoginService) {}
  cerrar() {
    sessionStorage.clear();
    localStorage.clear();
    
  }

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
