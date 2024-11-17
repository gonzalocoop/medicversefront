import { Component, OnInit } from '@angular/core';
import { ComentariosService } from '../../../services/comentarios.service';
import { SesionesService } from '../../../services/sesiones.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Comentarios } from '../../../models/Comentarios';
import { Sesiones } from '../../../models/Sesiones';
import { Usuarios } from '../../../models/Usuarios';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comentariosnegativos',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './comentariosnegativos.component.html',
  styleUrls: ['./comentariosnegativos.component.css']
})
export class ComentariosnegativosComponent implements OnInit {
  titulo: string = '';
  comentarios: Comentarios[] = [];
  listaSesiones: Sesiones[] = [];
  listaUsuarios: Usuarios[] = [];

  constructor(
    private comentariosService: ComentariosService,
    private sesionesService: SesionesService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    // Cargar sesiones y usuarios al inicio
    this.sesionesService.list().subscribe(data => {
      this.listaSesiones = data;
    });

    this.usuariosService.list().subscribe(data => {
      this.listaUsuarios = data;
    });
  }

  filtrarComentarios(): void {
    // Asegurarse de que `titulo` sea una cadena antes de llamar a `trim()`
    if (typeof this.titulo === 'string' && this.titulo.trim()) {
      this.comentariosService.listarMalosComentarios(this.titulo).subscribe(
        (data) => {
          this.comentarios = data;
        },
        (error) => {
          console.error('Error al obtener los comentarios negativos:', error);
        }
      );
    } else {
      // Si el título está vacío, limpiar la lista
      this.comentarios = [];
    }
  }
}
