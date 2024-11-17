import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CursosService } from '../../../services/cursos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contabilizarsesiones',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './contabilizarsesiones.component.html',
  styleUrls: ['./contabilizarsesiones.component.css'],
})
export class ContabilizarsesionesComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'pie';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];
  chartWidth: string = '35%';
  hayDatos: boolean = false; // Variable para controlar la disponibilidad de datos

  constructor(private cS: CursosService) {}

  ngOnInit(): void {
    this.cS.cantidadSesionesCurso().subscribe((data) => {
      if (data.length > 0) {
        this.hayDatos = true;
        this.barChartLabels = data.map((item) => item.titulo);
        this.barChartData = [
          {
            data: data.map((item) => item.quatitySesion),
            label: 'Cantidad de sesiones',
            backgroundColor: this.generateColors(data.length), // Genera colores dinámicamente
            borderColor: '#000000',
            borderWidth: 1,
          },
        ];

        if (data.length > 10) {
          this.barChartType = 'bar';
          this.barChartLegend = false;
          this.chartWidth = '70%';
          this.barChartOptions.plugins!.legend!.display = false; // Oculta la leyenda para 'bar'
        } else {
          this.barChartType = 'pie';
          this.barChartLegend = true;
          this.chartWidth = '35%';
          this.barChartOptions.plugins!.legend!.display = true; // Muestra la leyenda para 'pie'
        }
      } else {
        this.hayDatos = false; // Si no hay datos, muestra el mensaje de error
      }
    });
  }

  generateColors(length: number): string[] {
    const predefinedColors: string[] = [
      "#0a3866", "#004D40", "#FFE57F", "#ffb291",
      "#0f5194", "#009688", "#00838F", "#1375d6",
      "#B2DFDB", "#0097A7", "#807D7D", "#1b8eff", "#795548",
      "#B2EBF2", "#61a8ef", "#A1887F",
    ];

    // Si el número de colores solicitados excede los colores predefinidos
    if (length > predefinedColors.length) {
      // Generar colores adicionales dinámicamente para complementar
      const dynamicColors = Array.from({ length: length - predefinedColors.length }, () =>
        `#${Math.floor(Math.random() * 16777215).toString(16)}`
      );
      return [...predefinedColors, ...dynamicColors];
    }

    // Si no se excede, devolver una lista aleatoria de los predefinidos
    const colors: string[] = [];
    const availableColors = [...predefinedColors];

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableColors.length);
      const color = availableColors.splice(randomIndex, 1)[0];
      colors.push(color);
    }

    return colors;
  }
}
