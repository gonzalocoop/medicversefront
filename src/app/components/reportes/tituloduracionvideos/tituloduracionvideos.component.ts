import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sesiones } from '../../../models/Sesiones';
import { SesionesService } from '../../../services/sesiones.service';
import { SesionCantidadVideoDTO } from '../../../models/SesionCantidadVideoDTO';
import { MatTableModule } from '@angular/material/table';

interface SesionCantidadVideo {
  tituloSesion: string;
  tituloVideo: string;
  duracionVideo: number;
}

@Component({
  selector: 'app-tituloduracionvideos',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatButtonModule,MatTableModule],
  templateUrl: './tituloduracionvideos.component.html',
  styleUrl: './tituloduracionvideos.component.css'
})
export class TituloduracionvideosComponent implements OnInit {
  sesiones:Sesiones[]=[]
  sesionesVideos: SesionCantidadVideoDTO[] = [];
  displayedColumns: string[] = ['tituloSesion', 'tituloVideo', 'duracionVideo'];
  

  constructor(
    private sesionesService: SesionesService,
    
  ) {}

  ngOnInit(): void {
    // Cargar sesiones y usuarios al inicio
    this.cargarReporte();

   
  }

   cargarReporte(): void {
    this.sesionesService.tituloDuracionVideos().subscribe(
      (data: SesionCantidadVideoDTO[]) => {
        this.sesionesVideos = data;
      },
      (error) => {
        console.error('Error al cargar el reporte de sesiones y videos:', error);
      }
    );
  }

}


