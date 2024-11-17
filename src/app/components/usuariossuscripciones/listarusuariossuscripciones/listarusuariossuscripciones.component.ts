import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { UsuarioSuscripciones } from '../../../models/UsuarioSuscripciones';
import { UsuarioSuscripcionesService } from '../../../services/usuario-suscripciones.service';
import { catchError, of } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarusuariossuscripciones',
  standalone: true,
  imports: [MatTableModule,CommonModule,MatPaginator,MatIconModule,RouterModule],
  templateUrl: './listarusuariossuscripciones.component.html',
  styleUrl: './listarusuariossuscripciones.component.css'
})
export class ListarusuariossuscripcionesComponent implements OnInit{

  role: string = '';
  selectedUser: string = localStorage.getItem("username") ?? "";

  mensaje:string="";
  usuarioSuscripciones: UsuarioSuscripciones[] = []; 
  dataSource: MatTableDataSource<UsuarioSuscripciones> = new MatTableDataSource();
  displayedColumns:string[]=['c1','c2','c3','c4','c5','accion01','accion02'] //para indicar que es un conjunto o arreglo
  
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

 
  constructor(private lS: LoginService,private usS: UsuarioSuscripcionesService) {}
 
  ngOnInit(): void {  //subscribe: patron de diseño de software para devolver datos, en este caso de 
    this.role = this.lS.showRole();  // Aquí te aseguras de que el rol esté actualizado  
    const isAdmin = this.isAdmin(); // Verificar si el usuario es admin
    if (isAdmin) {
      this.displayedColumns.includes('accion02'); // Agregar "accion02" si es admin
    }else {
      const index = this.displayedColumns.indexOf('accion02');
      if (index !== -1) {
        this.displayedColumns.splice(index, 1); // Eliminar "accion02" si no es admin
      }
    }
    if (isAdmin) {
      // Si es admin, obtener todos los videos favoritos
      this.usS.list().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
    } else {
      
      this.usS.listPorUsuario(this.selectedUser).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
    }
      this.usS.getList().subscribe(data=>{
        this.dataSource=new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;  // Asignar el paginator a la dataSource aquí
      });
}
//para que siempre funcione el paginator
ngAfterViewInit(): void {
  // Asegúrate de que el paginador se aplica después de que se inicialice la vista
  this.dataSource.paginator = this.paginator;
}

eliminar(id:number){
  this.usS.delete(id).pipe(
    catchError((error)=>{
      this.mensaje='No se puede eliminar';
      this.ocultarMensaje()
      return of(null);
    })
  ).subscribe((data)=>{
    this.usS.list().subscribe((data)=>{
      this.usS.setList(data);
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
