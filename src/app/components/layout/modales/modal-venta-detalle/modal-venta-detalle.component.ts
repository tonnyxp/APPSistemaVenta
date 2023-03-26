import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/interfaces/venta';
import { VentaDetalle } from 'src/app/interfaces/venta-detalle';

@Component({
  selector: 'app-modal-venta-detalle',
  templateUrl: './modal-venta-detalle.component.html',
  styleUrls: ['./modal-venta-detalle.component.css']
})
export class ModalVentaDetalleComponent implements OnInit {

  fechaRegistro: string = '';
  numeroDocumento: string = '';
  tipoPago: string = '';
  total: string = '';
  ventaDetalle: VentaDetalle[] = [];
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta) {
    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.total = _venta.total;
    this.ventaDetalle = _venta.ventaDetalle;
  }

  ngOnInit(): void {
  }

}
