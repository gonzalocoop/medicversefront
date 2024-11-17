import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

import { catchError, of } from 'rxjs';
import { Videos } from '../../../models/Videos';
import { VideosService } from '../../../services/videos.service';

@Component({
  selector: 'app-listarvideos',
  standalone: true,
  imports: [MatTableModule,CommonModule,MatPaginator,MatIconModule,RouterModule],
  templateUrl: './listarvideos.component.html',
  styleUrl: './listarvideos.component.css'
})
export class ListarvideosComponent implements OnInit{
  dataSource: MatTableDataSource<Videos> = new MatTableDataSource();
  mensaje:string="";
  displayedColumns:string[]=['c1','c2','c3','c4','c5','c6','accion01','accion02'] //para indicar que es un conjunto o arreglo
  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Referencia al paginator
  //ngOnInit: El segundo metodo en ejecutarse, luego del constructor, segun angular . material
  constructor(private vS:VideosService){}  //Inyectamos service
  
  ngOnInit(): void {  //subscribe: patron de diseño de software para devolver datos, en este caso de 
      this.vS.list().subscribe(data=>{
        this.dataSource=new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;  // Asignar el paginator a la dataSource aquí
      })
      this.vS.getList().subscribe(data=>{
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
    this.vS.delete(id).pipe(
      catchError((error)=>{
        this.mensaje='No se puede eliminar, tiene videos favoritos registrados con este video';
        this.ocultarMensaje()
        return of(null);
      })
    ).subscribe((data)=>{
      this.vS.list().subscribe((data)=>{
        this.vS.setList(data);
      });
    });
  }
  
  ocultarMensaje(){
    setTimeout(()=>{
      this.mensaje='';
    }, 3000);
  }
}
