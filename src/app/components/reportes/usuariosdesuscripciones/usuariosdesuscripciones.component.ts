import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioSuscripcionesService } from '../../../services/usuario-suscripciones.service';
import { UsuariosTipoSuscripcionDTO } from '../../../models/UsuariosTipoSuscripcionDTO';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-usuariosdesuscripciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  templateUrl: './usuariosdesuscripciones.component.html',
  styleUrl: './usuariosdesuscripciones.component.css'
})

export class UsuariosdesuscripcionesComponent implements OnInit {
  nombreSuscripcion: string = '';
  usuarios: UsuariosTipoSuscripcionDTO[] = [];
  displayedColumns: string[] = ['nombre', 'username'];
  busquedaRealizada: boolean = false;

  constructor(private usS: UsuarioSuscripcionesService) {}

  ngOnInit(): void {}

  buscarUsuarios(): void {
    if (this.nombreSuscripcion.trim()) {
      this.busquedaRealizada = true; // Marcamos que se realizó una búsqueda
      this.usS.usuariosTipoSuscripcion(this.nombreSuscripcion)
        .subscribe({
          next: (data) => {
            this.usuarios = data;
          },
          error: (e) => {
            console.error('Error al obtener usuarios:', e);
            this.usuarios = []; // Aseguramos que la lista esté vacía en caso de error
          }
        });
    }
  }
}