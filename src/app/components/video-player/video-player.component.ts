import { Component, Input, OnChanges } from '@angular/core';
import { YoutubeService } from '../../services/youtube.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent {
  @Input() videoId: string | undefined; // Recibe el VIDEO ID como input
  videoDetails: any;
  sanitizedVideoUrl: any;
  inputVideoId: string = ''; // Para almacenar el ID ingresado por el usuario

  constructor(private youtubeService: YoutubeService, private sanitizer: DomSanitizer) {}

  loadVideo() {
    if (this.inputVideoId) {
      // Busca los detalles del video usando el ID ingresado por el usuario
      this.youtubeService.getVideoDetails(this.inputVideoId).subscribe(
        (data) => {
          if (data.items.length > 0) {
            this.videoDetails = data.items[0].snippet; // Almacena los detalles del video
            this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.inputVideoId}`);
          }
        },
        (error) => {
          console.error('Error fetching video details', error);
        }
      );
    }
  }
}