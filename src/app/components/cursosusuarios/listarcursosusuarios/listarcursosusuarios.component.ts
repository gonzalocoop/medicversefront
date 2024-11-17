import {  Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CursosUsuarios } from '../../../models/CursosUsuarios';
import { CursosUsuariosService } from '../../../services/cursos-usuarios.service';
import { LoginService } from '../../../services/login.service';


@Component({
  selector: 'app-listarcursosusuarios',
  standalone: true,
  imports: [CommonModule, MatPaginator, MatIconModule, MatCardModule, RouterModule],
  templateUrl: './listarcursosusuarios.component.html',
  styleUrl: './listarcursosusuarios.component.css'
})
export class ListarcursosusuariosComponent implements OnInit{
  role: string = '';
  selectedUser: string = localStorage.getItem("username") ?? "";
  mensaje:string="";
  cursosUsuarios: CursosUsuarios[] = []; // Arreglo que contiene todos los cursos
  pagedCursosUsuarios: CursosUsuarios[] = []; // Cursos de la página actual para mostrar en las tarjetas
  
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Referencia al paginador para controlarlo

  // Inyecta el servicio `CursosService` para acceder a los datos de cursos
  constructor(private lS: LoginService,private cS: CursosUsuariosService) {}

  ngOnInit(): void {
    this.role = this.lS.showRole();  // Aquí te aseguras de que el rol esté actualizado  
    const isAdmin = this.isAdmin(); // Verificar si el usuario es admin
    // Suscripción para obtener la lista completa de cursos y actualizar `pagedCursos`
    if (isAdmin) {
      this.cS.list().subscribe(data => {
        this.cursosUsuarios = data;       // Guarda todos los cursos obtenidos
        this.updatePagedCursos();  // Muestra solo los cursos de la página actual
      });
    } else{
      this.cS.cursousuarioPorusuario(this.selectedUser).subscribe((data) => {
        this.cursosUsuarios = data; 
        this.updatePagedCursos(); 
      })
    } 
      this.cS.getList().subscribe(data => {
      this.cursosUsuarios = data;       // Guarda todos los cursos actualizados
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
      this.pagedCursosUsuarios = this.cursosUsuarios.slice(startIndex, endIndex); // Extraer cursos paginados
    } else {
      // Mostrar los primeros 10 cursos si el paginador no está disponible
      this.pagedCursosUsuarios = this.cursosUsuarios.slice(0, 10);
    }
  }

  // Llama al servicio para eliminar un curso por ID y actualiza la lista de cursos y la vista de la página actual
  eliminar(id: number): void {
    this.cS.delete(id).pipe(
      catchError((error)=>{
        this.mensaje='No se puede eliminar, tiene cronogramas registrados en este curso de usuario';
        this.ocultarMensaje()
        return of(null);
      })
    ).subscribe(() => {
      // Actualizar la lista después de la eliminación
      this.cS.list().subscribe(data => {
        this.cursosUsuarios = data;
        this.updatePagedCursos();
        // Resetear el paginador a la primera página
        this.paginator.pageIndex = 0; // Reiniciar a la primera página
        this.paginator.length = this.cursosUsuarios.length; // Actualizar la longitud del paginador
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
