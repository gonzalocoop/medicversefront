import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterModule,MatToolbarModule,MatIconModule, MatMenuModule, MatButtonModule ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit{

  showWelcomeMessage = true;
  selectedUser: string = localStorage.getItem("username") ?? "";
  role: string = '';
  constructor(private router: Router,private loginService: LoginService) {}

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }


  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Oculta el mensaje si la ruta actual es un reporte específico
        this.showWelcomeMessage = this.router.url === '/reportes';
      }
    });
  }
}
