import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/interfaces/rol';
import { Usuario } from 'src/app/interfaces/usuario';

import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';


@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaRoles: Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private rolServicio: RolService,
    private usuarioServicio: UsuarioService,
    private utilidadServicio: UtilidadService
  ) {
    this.formularioUsuario = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      rolId: ['', Validators.required],
      clave: ['', Validators.required],
      activo: ['1', Validators.required]
    });

    if (this.datosUsuario != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this.rolServicio.lista().subscribe({
      next: (response) => {
        if (response.status) this.listaRoles = response.data;
      },
      error: () => { }
    });

  }

  ngOnInit(): void {
    if (this.datosUsuario != null) {
      this.formularioUsuario.patchValue({
        nombre: this.datosUsuario.nombre,
        correo: this.datosUsuario.correo,
        rolId: this.datosUsuario.rolId,
        clave: this.datosUsuario.clave,
        activo: this.datosUsuario.activo.toString()
      });
    }
  }

  guardarEditarUsuario() {
    const usuario: Usuario = {
      usuarioId: this.datosUsuario == null ? 0 : this.datosUsuario.usuarioId,
      nombre: this.formularioUsuario.value.nombre,
      correo: this.formularioUsuario.value.correo,
      rolId: this.formularioUsuario.value.rolId,
      rolDescripcion: "",
      clave: this.formularioUsuario.value.clave,
      activo: parseInt(this.formularioUsuario.value.activo)
    }

    if (this.datosUsuario == null) {
      this.usuarioServicio.guardar(usuario).subscribe({
        next: (response) => {
          if (response.status) {
            this.utilidadServicio.mostrarAlerta("El usuario fue registrado", "Exito");
            this.modalActual.close("true");
          } else {
            this.utilidadServicio.mostrarAlerta("No se pudo registrar el usuario", "Error");
          }
        },
        error: () => { }
      });
    } else {
      this.usuarioServicio.editar(usuario).subscribe({
        next: (response) => {
          if (response.status) {
            this.utilidadServicio.mostrarAlerta("El usuario fue editado", "Exito");
            this.modalActual.close("true");
          } else {
            this.utilidadServicio.mostrarAlerta("No se pudo editar el usuario", "Error");
          }
        },
        error: () => { }
      });
    }
  }

}
