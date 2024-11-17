import { CommonModule } from "@angular/common";
import {  Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { RouterModule } from "@angular/router";
import { Comentarios } from "../../../models/Comentarios";
import { catchError, of } from "rxjs";
import { ComentariosService } from "../../../services/comentarios.service";
import { LoginService } from "../../../services/login.service";

@Component({
  selector: 'app-listarcomentarios',
  standalone: true,
  imports: [CommonModule, MatPaginator,MatIconModule, MatCardModule, RouterModule],
  templateUrl: './listarcomentarios.component.html',
  styleUrl: './listarcomentarios.component.css'
})
export class ListarcomentariosComponent implements OnInit{
  role: string = '';
  selectedUser: string = localStorage.getItem("username") ?? "";
  mensaje:string="";
  comentarios: Comentarios[] = []; // Arreglo que contiene todos los cursos
  pagedComentarios: Comentarios[] = []; // Cursos de la página actual para mostrar en las tarjetas
  
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Referencia al paginador para controlarlo

  // Inyecta el servicio `SesiionesService` para acceder a los datos de cursos
  constructor(private cS: ComentariosService,private lS: LoginService) {}

  ngOnInit(): void {
    this.role = this.lS.showRole();  // Aquí te aseguras de que el rol esté actualizado  
    const isAdmin = this.isAdmin(); // Verificar si el usuario es admin
    if (isAdmin) {
      this.cS.list().subscribe(data => {
        this.comentarios = data;       // Guarda todos los cursos obtenidos
        this.updatePagedCursos();  // Muestra solo los cursos de la página actual
      });
    } else{
      this.cS.comentarioPorusuario(this.selectedUser).subscribe((data) => {
        this.comentarios = data; 
        this.updatePagedCursos(); 
      })
    }
    // Escucha actualizaciones en el servicio y vuelve a cargar `cursos` y `pagedCursos`
    this.cS.getList().subscribe(data => {
      this.comentarios = data;       // Guarda todos los cursos actualizados
      this.updatePagedCursos(); // Actualiza la vista con la página actual
    });
  }

  // Después de que la vista se inicializa, suscríbete a cambios de página del paginador
  ngAfterViewInit(): void {
    // Actualiza los cursos que se muestran en cada cambio de página
    this.paginator.page.subscribe(() => this.updatePagedCursos());
  }

  // Actualiza los cursos visibles según el índice de página y el tamaño de página del paginador
  updatePagedCursos(): void {
    if (this.paginator) { // Verificar que el paginador esté definido
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize; // Calcular índice inicial
      const endIndex = startIndex + this.paginator.pageSize; // Calcular índice final
      this.pagedComentarios = this.comentarios.slice(startIndex, endIndex); // Extraer cursos paginados
    } else {
      // Mostrar los primeros 10 cursos si el paginador no está disponible
      this.pagedComentarios = this.comentarios.slice(0, 10);
    }
  }

  // Llama al servicio para eliminar un curso por ID y actualiza la lista de cursos y la vista de la página actual
  eliminar(id: number): void {
    this.cS.delete(id).pipe(
      catchError((error)=>{
        this.mensaje='No se puede eliminar, tiene videos registrados en esta sesión';
        this.ocultarMensaje()
        return of(null);
      })
    ).subscribe(() => {
      // Actualizar la lista después de la eliminación
      this.cS.list().subscribe(data => {
        this.comentarios = data;
        this.updatePagedCursos();
        // Resetear el paginador a la primera página
        this.paginator.pageIndex = 0; // Reiniciar a la primera página
        this.paginator.length = this.comentarios.length; // Actualizar la longitud del paginador
      });
    });
  }
  ocultarMensaje(){
    setTimeout(()=>{
      this.mensaje='';
    }, 3000);
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

