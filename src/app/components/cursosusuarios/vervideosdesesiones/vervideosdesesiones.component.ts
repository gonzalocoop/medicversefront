import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { CursosUsuarios } from '../../../models/CursosUsuarios';
import { CursosUsuariosService } from '../../../services/cursos-usuarios.service';
import { CommonModule } from '@angular/common';
import { Usuarios } from '../../../models/Usuarios';
import { CompartiruserService } from '../../../services/compartiruser.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Sesiones } from '../../../models/Sesiones';
import { SesionesService } from '../../../services/sesiones.service';
import { Videos } from '../../../models/Videos';
import { VideosService } from '../../../services/videos.service';
import { YoutubeService } from '../../../services/youtube.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-vervideosdesesiones',
  standalone: true,
  imports: [RouterModule,CommonModule, MatCardModule, MatIconModule],
  templateUrl: './vervideosdesesiones.component.html',
  styleUrl: './vervideosdesesiones.component.css'
})
export class VervideosdesesionesComponent implements OnInit{
  sesion: Sesiones= new Sesiones();
  idCursoUsuario: number = 0; // Variable para almacenar el ID del curso usuario
  idSesion: number = 0; // Variable para almacenar el ID de la sesión
  selectedUser: Usuarios | null = null; // Variable para almacenar el usuario seleccionado

  videos: Videos[] = []; // Arreglo que contiene todos los cursos
  pagedVideos: Videos[] = []; // Cursos de la página actual para mostrar en las tarjetas

  videoDetails: { [key: number]: any } = {};
  sanitizedVideoUrls: { [key: number]: SafeResourceUrl } = {};

  // Inyecta los servicios necesarios en el constructor
  constructor(private youtubeService: YoutubeService, private sanitizer: DomSanitizer,private vS: VideosService,private sS: SesionesService,private route: ActivatedRoute, private cuS: CursosUsuariosService, private router: Router,    private usuariocompartido: CompartiruserService // Inyecta el servicio compartido
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.idCursoUsuario = +data['idCursoUsuario'];
      this.idSesion = +data['idSesion'];
      this.obtenerVideos();
    });

    this.usuariocompartido.selectedUser$.subscribe(user => {
      this.selectedUser = user;
    });
  }

  obtenerVideos(): void {
    this.sS.listId(this.idSesion).subscribe((data: Sesiones) => {
      this.sesion = data;
      this.vS.listPorSesion(this.sesion.titulo).subscribe(videos => {
        this.videos = videos;
        this.videos.forEach(video => this.loadVideo(video));
      });
    });
  }

  loadVideo(video: Videos): void {
    const videoUrl = `https://www.youtube.com/embed/${video.url}`;
    
    this.youtubeService.getVideoDetails(video.url).subscribe(
      (data) => {
        if (data.items.length > 0) {
          // Guardar detalles del video si necesitas mostrarlos
          this.videoDetails[video.id] = data.items[0].snippet;
          
          // Sanitizar y almacenar la URL del video para el iframe
          this.sanitizedVideoUrls[video.id] = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
        }
      },
      (error) => {
        console.error('Error fetching video details', error);
      }
    );
  }

 
}

