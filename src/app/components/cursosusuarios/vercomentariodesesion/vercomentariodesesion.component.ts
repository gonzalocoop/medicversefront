import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Comentarios } from '../../../models/Comentarios';
import { ComentariosService } from '../../../services/comentarios.service';
import { SesionesService } from '../../../services/sesiones.service';
import { Sesiones } from '../../../models/Sesiones';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-vercomentariodesesion',
  standalone: true,
  imports: [RouterModule,CommonModule,MatPaginator, MatCardModule],
  templateUrl: './vercomentariodesesion.component.html',
  styleUrl: './vercomentariodesesion.component.css'
})
export class VercomentariodesesionComponent implements OnInit{
  idSesion: number = 0; // ID del curso
  idCursoUsuario: number = 0; // Variable para almacenar el ID del curso usuario
  sesion: Sesiones= new Sesiones();
  comentarios: Comentarios[] = []; // Arreglo que contiene todos los cursos
  pagedComentarios: Comentarios[] = []; // Cursos de la página actual para mostrar en las tarjetas
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Referencia al paginador para controlarlo


  // Inyecta los servicios necesarios en el constructor
  constructor(private sS:SesionesService,private cS: ComentariosService,private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta para obtener el ID del curso
    this.route.params.subscribe((data: Params) => {
      this.idCursoUsuario = +data['idCursoUsuario'];
      this.idSesion = data['idSesion']; // Obtener el ID del curso de los parámetros
      this.obtenerComentarios(); // Llamar a la función para obtener el curso
    });

  }

  
  // Después de que la vista se inicializa, suscríbete a cambios de página del paginador
  ngAfterViewInit(): void {
    // Actualiza los cursos que se muestran en cada cambio de página
    this.paginator.page.subscribe(() => this.updatePagedComentarios());
  }


  // Actualiza los cursos visibles según el índice de página y el tamaño de página del paginador
  updatePagedComentarios(): void {
    if (this.paginator) { // Verificar que el paginador esté definido
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize; // Calcular índice inicial
      const endIndex = startIndex + this.paginator.pageSize; // Calcular índice final
      this.pagedComentarios = this.comentarios.slice(startIndex, endIndex); // Extraer cursos paginados
    } else {
      // Mostrar los primeros 10 cursos si el paginador no está disponible
      this.pagedComentarios = this.comentarios.slice(0, 10);
    }
  }

  
  obtenerComentarios(): void {
    this.sS.listId(this.idSesion).subscribe((data: Sesiones) => {
      this.sesion = data; 
      //Obtener comentarios
    this.cS.listPorSesion(this.sesion.titulo).subscribe(coment => {
      this.comentarios = coment;       // Guarda todos los comentarios obtenidos
      this.updatePagedComentarios();  // Muestra solo los comentarios de la página actual
    })// Escucha actualizaciones en el servicio y vuelve a cargar `comentarios` y `pagedComentarios`
    this.cS.getList().subscribe(comenta => {
      this.comentarios = comenta;       // Guarda todos los comentarios actualizados
      this.updatePagedComentarios(); // Actualiza la vista con la página actual
    });
    });
    
  }
}
