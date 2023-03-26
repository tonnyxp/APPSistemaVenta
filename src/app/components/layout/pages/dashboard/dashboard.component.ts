import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalIngresos: string = '0';
  totalVentas: string = '0';
  totalProductos: string = '0';

  constructor(
    private dashboardServicio: DashboardService
  ) { }

  mostrarGrafico(labelGrafico: any[], dataGrafico: any) {

    const charBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  }

  ngOnInit(): void {
    this.dashboardServicio.resumen().subscribe({
      next: (response) => {
        if (response.status) {
          this.totalIngresos = response.data.totalIngresos;
          this.totalVentas = response.data.totalVentas;
          this.totalProductos = response.data.totalProductos;

          const arrayData: any[] = response.data.ventasUltimaSemana;

          const labelTemp = arrayData.map(value => value.fecha);
          const dataTemp = arrayData.map(value => value.total);

          this.mostrarGrafico(labelTemp, dataTemp);
        }
      },
      error: () => { }
    })
  }

}
