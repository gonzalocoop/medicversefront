import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { VideosFavoritos } from '../../../models/VideosFavoritos';
import { VideosFavoritosService } from '../../../services/videosfavoritos.service';
import { catchError, of } from 'rxjs';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-listarvideosfavoritos',
  standalone: true,
  imports: [MatTableModule,CommonModule,MatPaginator,MatIconModule,RouterModule],
  templateUrl: './listarvideosfavoritos.component.html',
  styleUrl: './listarvideosfavoritos.component.css'
})
export class ListarvideosfavoritosComponent implements OnInit{
  role: string = '';
  selectedUser: string = localStorage.getItem("username") ?? "";

  dataSource: MatTableDataSource<VideosFavoritos> = new MatTableDataSource();
  mensaje:string="";
  displayedColumns:string[]=['c1','c2','c3','accion01','accion02'] //para indicar que es un conjunto o arreglo
  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Referencia al paginator
  //ngOnInit: El segundo metodo en ejecutarse, luego del constructor, segun angular . material
  constructor(private lS: LoginService,private fS:VideosFavoritosService){}  //Inyectamos service
  
  ngOnInit(): void {  //subscribe: patron de diseño de software para devolver datos, en este caso de 
    this.role = this.lS.showRole();  // Aquí te aseguras de que el rol esté actualizado  
    const isAdmin = this.isAdmin(); // Verificar si el usuario es admin

    if (isAdmin) {
      // Si es admin, obtener todos los videos favoritos
      this.fS.list().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
    } else {
      
      this.fS.listPorUsuario(this.selectedUser).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
    }
      this.fS.getList().subscribe(data=>{
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
    this.fS.delete(id).pipe(
      catchError((error)=>{
        this.mensaje='No se puede eliminar, tiene usuarios registrados en esta suscripcion';
        this.ocultarMensaje()
        return of(null);
      })
    ).subscribe((data)=>{
      this.fS.list().subscribe((data)=>{
        this.fS.setList(data);
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