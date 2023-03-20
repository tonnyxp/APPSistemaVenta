import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from 'src/app/services/producto.service';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

import { Producto } from 'src/app/interfaces/producto';
import { Venta } from 'src/app/interfaces/venta';
import { VentaDetalle } from 'src/app/interfaces/venta-detalle';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaProductoFiltro: Producto[] = [];

  listaProductosParaVenta: VentaDetalle[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  tipoPagoPorDefecto: string = 'Efectivo';
  totalPagar: number = 0;

  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosVentaDetalle = new MatTableDataSource<VentaDetalle>(this.listaProductosParaVenta);

  retornarProductosPorFiltro(busqueda: any): Producto[] {
    let valorBuscado = typeof busqueda === 'string' ? busqueda.toLowerCase() : busqueda.nombre.toLowerCase();

    return this.listaProductos.filter(item => item.nombre.toLowerCase().includes(valorBuscado));
  }

  constructor(
    private fb: FormBuilder,
    private productoServicio: ProductoService,
    private ventaServicio: VentaService,
    private utilidadServicio: UtilidadService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: [1, Validators.required]
    });

    this.productoServicio.lista().subscribe({
      next: (response) => {
        if (response.status) {
          const lista = response.data as Producto[];
          this.listaProductos = lista.filter(p => p.activo == 1 && p.existencia > 0);
        }
      },
      error: () => { }
    });

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductoFiltro = this.retornarProductosPorFiltro(value);
    });

  }

  ngOnInit(): void {
  }

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoParaVenta() {
    const cantidad: number = this.formularioProductoVenta.value.cantidad;
    const precio: number = parseFloat(this.productoSeleccionado.precio);
    const total: number = cantidad * precio;
    this.totalPagar += total;

    this.listaProductosParaVenta.push({
      productoId: this.productoSeleccionado.productoId,
      productoDescripcion: this.productoSeleccionado.nombre,
      cantidad: cantidad,
      precio: String(precio.toFixed(2)),
      total: String(total.toFixed(2))
    });

    this.datosVentaDetalle = new MatTableDataSource<VentaDetalle>(this.listaProductosParaVenta);

    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: 1
    });
  }

  eliminarProducto(detalle: VentaDetalle) {
    this.totalPagar -= parseFloat(detalle.total);
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.productoId != detalle.productoId);

    this.datosVentaDetalle = new MatTableDataSource<VentaDetalle>(this.listaProductosParaVenta);
  }

  registrarVenta() {
    if (this.listaProductosParaVenta.length > 0) {
      this.bloquearBotonRegistrar = true;

      const request: Venta = {
        tipoPago: this.tipoPagoPorDefecto,
        total: String(this.totalPagar.toFixed(2)),
        ventaDetalle: this.listaProductosParaVenta
      };

      this.ventaServicio.registrar(request).subscribe({
        next: (response) => {
          if (response.status) {
            this.totalPagar = 0.00;
            this.listaProductosParaVenta = [];
            this.datosVentaDetalle = new MatTableDataSource<VentaDetalle>(this.listaProductosParaVenta);

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!',
              text: `Numero de venta ${response.data.numeroDocumento}`
            });
          } else {
            this.utilidadServicio.mostrarAlerta("No se pudo registrar la venta", "Oops");
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        error: () => { }
      });
    }
  }
}
