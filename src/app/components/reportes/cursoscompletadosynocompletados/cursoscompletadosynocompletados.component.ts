import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CursosUsuariosService } from '../../../services/cursos-usuarios.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule

@Component({
  selector: 'app-cursoscompletadosynocompletados',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],  // Asegúrate de que CommonModule esté aquí
  templateUrl: './cursoscompletadosynocompletados.component.html',
  styleUrl: './cursoscompletadosynocompletados.component.css'
})
export class CursoscompletadosynocompletadosComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Cursos Completados',
        backgroundColor: '#FFE57F',
        borderColor: '#000000',
        borderWidth: 1
      },
      {
        data: [],
        label: 'Cursos No Completados',
        backgroundColor: '#1375d6',
        borderColor: '#000000',
        borderWidth: 1
      }
    ],
    labels: []
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public hayDatos: boolean = true;  // Nueva variable para controlar si hay datos

  constructor(
    private cuS: CursosUsuariosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.cuS.cantidadCursosCompletadosYNoCompletados().subscribe((data) => {
      if (data && data.length > 0 && data.some(item => item.cursosCompletados > 0 || item.cursosNoCompletados > 0)) {
        // Si hay datos válidos, actualizar la gráfica
        this.hayDatos = true;
        this.barChartData.labels = data.map(item => item.username);
        this.barChartData.datasets[0].data = data.map(item => item.cursosCompletados);
        this.barChartData.datasets[1].data = data.map(item => item.cursosNoCompletados);

        // Forzar la actualización del gráfico
        this.chart?.update();
        this.cdr.detectChanges();
      } else {
        // Si no hay datos válidos, mostrar mensaje de error
        this.hayDatos = false;
      }
    });
  }
}