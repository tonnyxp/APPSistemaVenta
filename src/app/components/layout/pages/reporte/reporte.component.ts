import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import * as XLSX from 'xlsx';

import { Reporte } from 'src/app/interfaces/reporte';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class ReporteComponent implements OnInit, AfterViewInit {

  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = ['fechaRegistro', 'numeroVenta', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource<Reporte>(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private ventaServicio: VentaService,
    private utilidadServicio: UtilidadService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas() {
    const fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if (fechaInicio === 'Invalid date' || fechaFin === 'Invalid date') {
      this.utilidadServicio.mostrarAlerta('Debe ingresar ambas fechas', 'Oops!');
      return;
    }

    this.ventaServicio.reporte(fechaInicio, fechaFin).subscribe({
      next: (response) => {
        if (response.status) {
          this.listaVentasReporte = response.data;
          this.dataVentaReporte.data = response.data;
        } else {
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this.utilidadServicio.mostrarAlerta('No se encontraron datos', 'Oops!');
        }
      },
      error: () => { }
    });
  }

  exportarExcel() {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listaVentasReporte);

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'Reporte Ventas.xlsx');
  }

}
