import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Cronogramas } from '../../../models/Cronogramas';
import { CronogramasService } from '../../../services/cronogramas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verdetallecrono',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './verdetallecrono.component.html',
  styleUrl: './verdetallecrono.component.css'
})
export class VerdetallecronoComponent implements OnInit{
  Cronogramas: Cronogramas = new Cronogramas(); // Objeto para almacenar los detalles del curso
  id: number = 0; // ID del curso

  // Inyecta los servicios necesarios en el constructor
  constructor(private route: ActivatedRoute, private cS: CronogramasService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta para obtener el ID del curso
    this.route.params.subscribe((data: Params) => {
      this.id = data['id']; // Obtener el ID del curso de los parámetros
      this.obtenerCronogramas(); // Llamar a la función para obtener el curso
    });
  }

  // Función para obtener el curso por ID desde el servicio
  obtenerCronogramas(): void {
    this.cS.listId(this.id).subscribe((data: Cronogramas) => {
      this.Cronogramas = data; // Asignar el curso obtenido al objeto curso
    });
  }

}
