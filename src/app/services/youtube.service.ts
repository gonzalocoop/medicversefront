import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private apiURL = 'https://www.googleapis.com/youtube/v3/videos';
  private apiKey = 'AIzaSyAnaoW6UfTWPZcxXEN-8ruj_KxJ_ZaKNHk'; 

  constructor(private http: HttpClient) {}

  // Método que extrae el ID del video de YouTube a partir de la URL proporcionada
  extractVideoId(url: string): string | undefined {
    try {
      const urlObj = new URL(url);
      const id = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
      return id ? id : undefined;
    } catch (e) {
      console.error('URL inválida:', e);
      return undefined;
    }
  }

  // Hace una solicitud a la YouTube API para obtener información del video
  getVideoDetails(videoId: string): Observable<any> {
    const url = `${this.apiURL}?id=${videoId}&part=snippet&key=${this.apiKey}`;
    return this.http.get(url); // Realiza la solicitud GET a la API
  }
}
