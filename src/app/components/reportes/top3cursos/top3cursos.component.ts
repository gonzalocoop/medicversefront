import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ComentariosService } from '../../../services/comentarios.service';

@Component({
  selector: 'app-top3cursos',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './top3cursos.component.html',
  styleUrls: ['./top3cursos.component.css']
})
export class Top3cursosComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'pie';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];
  hayDatos: boolean = false; // Inicialmente no hay datos

  constructor(private cS: ComentariosService) {}

  ngOnInit(): void {
    this.cS.top3Cursos().subscribe((data) => {
      // Filtrar cursos con al menos un comentario
      const cursosConComentarios = data.filter((item) => item.cantidad > 0);

      if (cursosConComentarios.length > 0) {
        this.hayDatos = true;
        this.barChartLabels = cursosConComentarios.map((item) => item.titulo);
        this.barChartData = [
          {
            data: cursosConComentarios.map((item) => item.cantidad),
            label: 'Cantidad de comentarios',
            backgroundColor: ['#0f5194', '#ffb291', '#FFE57F'], // Colores específicos
            borderColor: '#000000',
            borderWidth: 1,
          },
        ];
      } else {
        this.hayDatos = false; // No hay cursos con comentarios
        this.barChartLabels = []; // Limpiar etiquetas
        this.barChartData = []; // Limpiar datos
      }
    });
  }
}
