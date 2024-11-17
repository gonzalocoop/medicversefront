import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [RouterModule,RouterOutlet,CommonModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent implements OnInit {
  isChildRoute: boolean = false; // Declara la propiedad

  constructor(private router: Router) {} // Inyecta el Router

  ngOnInit(): void {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            // Verifica si la URL actual incluye '/landing/' y no es la ruta principal
            this.isChildRoute = event.url.includes('/landing/') && event.url !== '/landing';
        }
    });
  }
}
