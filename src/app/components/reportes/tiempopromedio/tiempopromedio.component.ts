import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SesionesService } from '../../../services/sesiones.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tiempopromedio',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './tiempopromedio.component.html',
  styleUrls: ['./tiempopromedio.component.css']
})
export class TiempopromedioComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartData: ChartDataset[] = [];
  chartWidth: string = '45%';
  hayDatos: boolean = true; // Controla si hay datos disponibles

  constructor(private sS: SesionesService) {}

  ngOnInit(): void {
    this.sS.tiempoPromedio().subscribe((data) => {
      if (data && data.length > 0) {
        this.hayDatos = true;
        this.barChartLabels = data.map((item) => item.tituloSesion);
        this.barChartData = [
          {
            data: data.map((item) => item.duracionPromedio),
            label: 'Duración promedio',
            backgroundColor: this.generateColors(data.length), // Colores dinámicos
            borderColor: ['#000000'], // Bordes combinados
            borderWidth: 1,
          },
        ];
      } else {
        this.hayDatos = false; // Si no hay datos, mostramos el mensaje de error
        this.barChartLabels = []; // Limpiar etiquetas
        this.barChartData = []; // Limpiar datos
      }
    });
  }

  generateColors(length: number): string[] {
    const predefinedColors: string[] = [
      '#0a3866', '#004D40', '#FFE57F', '#ffb291',
      '#0f5194', '#009688', '#00838F', '#1375d6',
      '#B2DFDB', '#0097A7', '#807D7D', '#1b8eff', '#795548',
      '#B2EBF2', '#61a8ef', '#A1887F',
    ];

    // Aseguramos que la longitud solicitada no supere la cantidad de colores disponibles
    if (length > predefinedColors.length) {
      console.warn('La longitud solicitada excede la cantidad de colores disponibles. Usando colores predefinidos.');
      return predefinedColors.slice(0, length); // Tomar solo los primeros 'length' colores
    }

    const colors: string[] = [];
    const availableColors = [...predefinedColors]; // Copia del array original

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableColors.length);
      const color = availableColors.splice(randomIndex, 1)[0]; // Remueve y selecciona un color
      colors.push(color);
    }

    return colors;
  }
}
