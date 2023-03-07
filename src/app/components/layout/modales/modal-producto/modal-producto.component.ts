import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/interfaces/categoria';
import { Producto } from 'src/app/interfaces/producto';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {

  formularioProducto: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaCategorias: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private categoriaServicio: CategoriaService,
    private productoServicio: ProductoService,
    private utilidadServicio: UtilidadService
  ) {

    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      categoriaId: ['', Validators.required],
      existencia: ['', Validators.required],
      precio: ['', Validators.required],
      activo: ['1', Validators.required]
    });

    if (this.datosProducto != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this.categoriaServicio.lista().subscribe({
      next: (response) => {
        if (response.status) this.listaCategorias = response.data;
      },
      error: () => { }
    });
  }

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        categoriaId: this.datosProducto.categoriaId,
        existencia: this.datosProducto.existencia,
        precio: this.datosProducto.precio,
        activo: this.datosProducto.activo.toString()
      })
    }
  }

  guardarEditarProducto() {
    const producto: Producto = {
      productoId: this.datosProducto == null ? 0 : this.datosProducto.productoId,
      nombre: this.formularioProducto.value.nombre,
      categoriaId: this.formularioProducto.value.categoriaId,
      categoriaDescripcion: "",
      existencia: this.formularioProducto.value.existencia,
      precio: this.formularioProducto.value.precio,
      activo: parseInt(this.formularioProducto.value.activo)
    }

    if (this.datosProducto == null) {
      this.productoServicio.guardar(producto).subscribe({
        next: (response) => {
          if (response.status) {
            this.utilidadServicio.mostrarAlerta("El producto fue registrado", "Exito");
            this.modalActual.close("true");
          } else {
            this.utilidadServicio.mostrarAlerta("No se pudo registrar el producto", "Error");
          }
        },
        error: () => { }
      });
    } else {
      this.productoServicio.editar(producto).subscribe({
        next: (response) => {
          if (response.status) {
            this.utilidadServicio.mostrarAlerta("El producto fue editado", "Exito");
            this.modalActual.close("true");
          } else {
            this.utilidadServicio.mostrarAlerta("No se pudo editar el producto", "Error");
          }
        },
        error: () => { }
      });
    }
  }

}
