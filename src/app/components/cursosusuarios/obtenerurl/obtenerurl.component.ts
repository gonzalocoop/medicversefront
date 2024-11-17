import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { CursosUsuarios } from '../../../models/CursosUsuarios';
import { CursosUsuariosService } from '../../../services/cursos-usuarios.service';


@Component({
  selector: 'app-obtenerurl',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './obtenerurl.component.html',
  styleUrl: './obtenerurl.component.css'
})
export class ObtenerurlComponent implements OnInit{

  cursoUsuario: CursosUsuarios = new CursosUsuarios(); // Objeto para almacenar los detalles del curso
  id: number = 0; // ID del curso
  url: string = 'https://ibb.co/ZSXchyk';
  // Inyecta los servicios necesarios en el constructor
  constructor(private route: ActivatedRoute, private cuS: CursosUsuariosService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta para obtener el ID del curso
    this.route.params.subscribe((data: Params) => {
      this.id = data['idCursoUsuario']; // Obtener el ID del curso de los parámetros
      this.obtenerCursoUsuario(); // Llamar a la función para obtener el curso
    });
  }

  // Función para obtener el curso por ID desde el servicio
  obtenerCursoUsuario(): void {
    this.cuS.listId(this.id).subscribe((data: CursosUsuarios) => {
      this.cursoUsuario = data; // Asignar el curso obtenido al objeto curso
    });
  }
  openImage() {
    window.open(this.cursoUsuario.url, '_blank');
  }
}

