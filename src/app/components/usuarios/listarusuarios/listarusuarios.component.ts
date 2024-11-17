import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { Usuarios } from '../../../models/Usuarios';
import { UsuariosService } from '../../../services/usuarios.service';
import { catchError, of } from 'rxjs';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarusuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginator,
    MatIconModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './listarusuarios.component.html',
  styleUrl: './listarusuarios.component.css',
})
export class ListarusuariosComponent implements OnInit{
  role: string = '';
  selectedUser: string = localStorage.getItem("username") ?? "";

  mensaje: string = '';
  usuarios: Usuarios[] = []; 
  pagedUsuarios: Usuarios[] = []; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private lS: LoginService,private uS: UsuariosService) {}

  ngOnInit(): void {
    this.role = this.lS.showRole();  // Aquí te aseguras de que el rol esté actualizado  
    const isAdmin = this.isAdmin(); // Verificar si el usuario es admin
    if (isAdmin) {
      this.uS.list().subscribe((data) => {
      this.usuarios = data; // Guarda todos los cursos obtenidos
      this.updatePagedRoles(); // Muestra solo los cursos de la página actual
    });
  }  else{
    this.uS.usuarioPorUsername(this.selectedUser).subscribe((data) => {
      this.usuarios = [data]; // Guarda todos los cursos obtenidos
      this.updatePagedRoles(); // Muestra solo los cursos de la página actual
    })
  }
    
    // Escucha actualizaciones en el servicio y vuelve a cargar `cursos` y `pagedCursos`
    this.uS.getList().subscribe((data) => {
      this.usuarios = data; // Guarda todos los cursos actualizados
      this.updatePagedRoles(); // Actualiza la vista con la página actual
    });
  }

  ngAfterViewInit(): void {
    // Actualiza los cursos que se muestran en cada cambio de página
    this.paginator.page.subscribe(() => this.updatePagedRoles());
  }

  updatePagedRoles(): void {
    if (this.paginator) {
      // Verificar que el paginador esté definido
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize; // Calcular índice inicial
      const endIndex = startIndex + this.paginator.pageSize; // Calcular índice final
      this.pagedUsuarios = this.usuarios.slice(startIndex, endIndex); // Extraer cursos paginados
    } else {
      // Mostrar los primeros 10 cursos si el paginador no está disponible
      this.pagedUsuarios = this.usuarios.slice(0, 10);
    }
  }

  eliminar(id: number): void {
    this.uS
      .delete(id)
      .pipe(
        catchError((error) => {
          this.mensaje =
            'No se puede eliminar, tiene un componente ligado a este usuario';
          this.ocultarMensaje();
          return of(null);
        })
      )
      .subscribe(() => {
        // Actualizar la lista después de la eliminación
        this.uS.list().subscribe((data) => {
          this.usuarios = data;
          this.updatePagedRoles();
          // Resetear el paginador a la primera página
          this.paginator.pageIndex = 0; // Reiniciar a la primera página
          this.paginator.length = this.usuarios.length; // Actualizar la longitud del paginador
        });
      });
  }
  ocultarMensaje() {
    setTimeout(() => {
      this.mensaje = '';
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
