import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { SesionesService } from '../../../services/sesiones.service';
import { Sesiones } from '../../../models/Sesiones';


@Component({
  selector: 'app-verdescripcionses',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './verdescripcionses.component.html',
  styleUrl: './verdescripcionses.component.css'
})
export class VerdescripcionsesComponent implements OnInit{
  sesion: Sesiones = new Sesiones(); // Objeto para almacenar los detalles del curso
  id: number = 0; // ID del curso

  // Inyecta los servicios necesarios en el constructor
  constructor(private route: ActivatedRoute, private sS: SesionesService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta para obtener el ID del curso
    this.route.params.subscribe((data: Params) => {
      this.id = data['id']; // Obtener el ID del curso de los parámetros
      this.obtenerCurso(); // Llamar a la función para obtener el curso
    });
  }

  // Función para obtener el curso por ID desde el servicio
  obtenerCurso(): void {
    this.sS.listId(this.id).subscribe((data: Sesiones) => {
      this.sesion = data; // Asignar el curso obtenido al objeto curso
    });
  }

}
