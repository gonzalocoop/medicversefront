import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Cursos } from '../../../models/Cursos';
import { CursosService } from '../../../services/cursos.service';

@Component({
  selector: 'app-verdescripcion',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './verdescripcion.component.html',
  styleUrl: './verdescripcion.component.css'
})
export class VerdescripcionComponent implements OnInit {
  curso: Cursos = new Cursos(); // Objeto para almacenar los detalles del curso
  id: number = 0; // ID del curso

  // Inyecta los servicios necesarios en el constructor
  constructor(private route: ActivatedRoute, private cS: CursosService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta para obtener el ID del curso
    this.route.params.subscribe((data: Params) => {
      this.id = data['id']; // Obtener el ID del curso de los parámetros
      this.obtenerCurso(); // Llamar a la función para obtener el curso
    });
  }

  // Función para obtener el curso por ID desde el servicio
  obtenerCurso(): void {
    this.cS.listId(this.id).subscribe((data: Cursos) => {
      this.curso = data; // Asignar el curso obtenido al objeto curso
    });
  }
}
