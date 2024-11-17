import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CursosService } from '../../../services/cursos.service';

@Component({
  selector: 'app-top5cursoscantsesionescategoriasesiones',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './top5cursoscantsesionescategoriasesiones.component.html',
  styleUrls: ['./top5cursoscantsesionescategoriasesiones.component.css']
})
export class Top5cursoscantsesionescategoriasesionesComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true, // El eje Y comienza desde 0
      }
    },
  };

  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];
  hayDatos: boolean = false; // Indicador para mostrar gráfico o mensaje de error

  constructor(private cS: CursosService) {}

  ngOnInit(): void {
    this.cS.top5CantSesiones().subscribe((data) => {
      if (data && data.length > 0) {
        this.hayDatos = true;

        // Rellenar las etiquetas con los nombres de los cursos
        this.barChartLabels = data.map(item => item.curso);

        // Colores dinámicos basados en la categoría del curso
        const backgroundColors = data.map(item => {
          switch (item.categoria) {
            case 'Bajo': return '#A1887F'; // verde para Básico
            case 'Medio': return '#FFE57F'; // naranja para Intermedio
            case 'Alto': return '#B2DFDB'; // rojo para Avanzado
            default: return '#A1887F'; // azul para otros
          }
        });

        const borderColors = data.map(() => '#000000'); // Color de borde negro

        // Configuración de los datos del gráfico
        this.barChartData = [
          {
            data: data.map(item => item.cantidadSesiones),
            label: 'Cantidad de Sesiones',
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          },
          {
            data: data.map(item => item.duracionCurso),
            label: 'Duración del Curso (días)',
            backgroundColor: ['#B2DFDB'], // Color fijo para la duración
            borderColor: '#000000', // Azul para la duración
            borderWidth: 2,
            borderDash: [5, 5], // Líneas punteadas para este dataset
          }
        ];
      } else {
        this.hayDatos = false; // No hay datos disponibles
      }
    });
  }
}
