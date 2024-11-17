import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CursosService } from '../../../services/cursos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cursosmasymenossuscripcionesdeusuarios',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './cursosmasymenossuscripcionesdeusuarios.component.html',
  styleUrls: ['./cursosmasymenossuscripcionesdeusuarios.component.css']
})
export class CursosmasymenossuscripcionesdeusuariosComponent implements OnInit {
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: ChartDataset[] = [];
  hayDatos: boolean = false; // Empezamos con false

  constructor(private cS: CursosService) {}

  ngOnInit(): void {
    this.cS.CursosMasMenosSuscripcionesDeUsuarios().subscribe((data) => {
      console.log('Datos recibidos:', data);

      // Filtrar los datos válidos (nombreCurso no vacío y numUsuarios mayor a 0)
      const datosValidos = data.filter(item => item.nombreCurso.trim() !== '' && item.numUsuarios > 0);

      if (datosValidos.length > 0) {
        // Si hay datos válidos, mostramos el gráfico
        this.hayDatos = true;
        this.barChartLabels = datosValidos.map(item => item.nombreCurso);
        this.barChartData = [
          {
            data: datosValidos.map(item => item.numUsuarios),
            label: 'Cantidad de Usuarios',
            backgroundColor: ['#009688', '#0097A7', '#61a8ef'], // Combinación de colores
            borderColor: ['#000000'], // Bordes combinados
            borderWidth: 1,
          },
        ];
      } else {
        // Si no hay datos válidos, mostramos el mensaje de error
        this.hayDatos = false;
        this.barChartData = []; // Vaciar los datos del gráfico
        this.barChartLabels = []; // Vaciar las etiquetas del gráfico
      }
    });
  }
}
