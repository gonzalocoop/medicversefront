import { Component, OnInit } from '@angular/core';
import { RecaudacionSuscripcionDTO } from '../../../models/RecaudacionSuscripcionDTO';
import { UsuarioSuscripcionesService } from '../../../services/usuario-suscripciones.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-recaudaciontotalsuscripcion',
  standalone: true,
  imports: [MatNativeDateModule,MatTableModule,MatFormFieldModule,FormsModule,MatInputModule, MatSelectModule,MatDatepickerModule,MatButtonModule,ReactiveFormsModule,CommonModule],
  templateUrl: './recaudaciontotalsuscripcion.component.html',
  styleUrl: './recaudaciontotalsuscripcion.component.css'
})
export class RecaudaciontotalsuscripcionComponent implements OnInit {
  nombreSuscripcion: string = '';
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  recaudaciones: RecaudacionSuscripcionDTO[] = [];

  constructor(private usuarioSuscripcionesService: UsuarioSuscripcionesService) {}

  ngOnInit(): void {
    // Establece fechas por defecto si lo deseas
    this.fechaInicio.setDate(this.fechaInicio.getDate() - 30); // Últimos 30 días por defecto
  }

  cargarRecaudacion(): void {
    // Verifica que las fechas sean válidas antes de enviarlas
    if (this.nombreSuscripcion && this.fechaInicio && this.fechaFin) {
      // Llama al servicio con las fechas como objetos Date
      this.usuarioSuscripcionesService.recaudacionSuscripciones(this.nombreSuscripcion, this.fechaInicio, this.fechaFin)
        .subscribe(
          (data: RecaudacionSuscripcionDTO[]) => {
            this.recaudaciones = data;
          },
          (error) => {
            console.error('Error al obtener la recaudación:', error);
          }
        );
    }
  }
}
