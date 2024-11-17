import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Comentarios } from '../../../models/Comentarios';
import { ComentariosService } from '../../../services/comentarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vercomentario',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './vercomentario.component.html',
  styleUrl: './vercomentario.component.css'
})
export class VercomentarioComponent {
  comentarios: Comentarios = new Comentarios(); // Objeto para almacenar los detalles del curso
  id: number = 0; // ID del curso

  // Inyecta los servicios necesarios en el constructor
  constructor(private route: ActivatedRoute, private cS: ComentariosService, private router:Router) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta para obtener el ID del curso
    this.route.params.subscribe((data: Params) => {
      this.id = data['id']; // Obtener el ID del curso de los parámetros
      this.obtenerCurso(); // Llamar a la función para obtener el curso
    });
  }

  // Función para obtener el curso por ID desde el servicio
  obtenerCurso(): void {
    this.cS.listId(this.id).subscribe((data: Comentarios) => {
      this.comentarios = data; // Asignar el curso obtenido al objeto curso
    });
  }
}
