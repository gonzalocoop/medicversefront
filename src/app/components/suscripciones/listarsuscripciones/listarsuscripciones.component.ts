import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Suscripciones } from '../../../models/Suscripciones';
import { SuscripcionService } from '../../../services/suscripcion.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-listarsuscripciones',
  standalone: true,
  imports: [MatTableModule,CommonModule,MatPaginator,MatIconModule,RouterModule],
  templateUrl: './listarsuscripciones.component.html',
  styleUrl: './listarsuscripciones.component.css'
})
export class ListarsuscripcionesComponent implements OnInit{

  dataSource: MatTableDataSource<Suscripciones> = new MatTableDataSource();
  mensaje:string="";
  displayedColumns:string[]=['c1','c2','c3','accion01','accion02'] //para indicar que es un conjunto o arreglo
  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Referencia al paginator
  //ngOnInit: El segundo metodo en ejecutarse, luego del constructor, segun angular . material
  constructor(private sS:SuscripcionService){}  //Inyectamos service
  
  ngOnInit(): void {  //subscribe: patron de diseño de software para devolver datos, en este caso de 
      this.sS.list().subscribe(data=>{
        this.dataSource=new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;  // Asignar el paginator a la dataSource aquí
      })
      this.sS.getList().subscribe(data=>{
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
    this.sS.delete(id).pipe(
      catchError((error)=>{
        this.mensaje='No se puede eliminar, tiene usuarios registrados en esta suscripción';
        this.ocultarMensaje()
        return of(null);
      })
    ).subscribe((data)=>{
      this.sS.list().subscribe((data)=>{
        this.sS.setList(data);
      });
    });
  }
  
  ocultarMensaje(){
    setTimeout(()=>{
      this.mensaje='';
    }, 3000);
  }
}
