import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FusionStatusResponse } from '../../model/FusionStatusResponse';
import { SnackbarService } from '../../services/snackbar.service';
import { environment } from '../../../environments/environment.prod';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-dialog-enviar-boleta-correo',
  templateUrl: './dialog-enviar-boleta-correo.component.html',
  styleUrls: ['./dialog-enviar-boleta-correo.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogEnviarBoletaCorreoComponent implements OnInit {
  public form!: FormGroup;
  public fusionStatusResponse?: FusionStatusResponse;
  public iniciarLlamadaBackend = false;
  public correoEnviado = false;
  constructor(
    public dialogRef: MatDialogRef<DialogEnviarBoletaCorreoComponent>, private emailService: EmailService,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { fusionStatusResponse: FusionStatusResponse },
    private snackbarService: SnackbarService
    ) { }

  ngOnInit(): void {
    this.iniciarLlamadaBackend = false;
    this.correoEnviado = false;
    const {fusionStatusResponse} = this.data;
    if (!fusionStatusResponse) {
      this.cerrar();
      return;
    }
    this.fusionStatusResponse = fusionStatusResponse;
    this.crearControles();
  }

  crearControles(): void {
    this.form = this.fb.group({
      email:  ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }
  habilitarDesabilitarTodosInput(accion: string): void {
    Object.keys(this.form.controls).forEach(key => {
      if (accion === 'disable') {
        this.form.controls[key].disable();
      } else{
        this.form.controls[key].enable();
      }
    });
  }
  enviarBoleta(): void {
    if (this.form.valid) {
      this.iniciarLlamadaBackend = true;
      const email       = this.form.controls.email.value.toLowerCase().trim();
      const trxid       = this.fusionStatusResponse?.trxid || '';
      const frontendid  = this.fusionStatusResponse?.frontendid;
      this.habilitarDesabilitarTodosInput('disable');
      this.emailService.enviarBoletaPorEmail(email, frontendid, trxid).subscribe(
        (respuesta) => {
          this.iniciarLlamadaBackend = false;
          this.habilitarDesabilitarTodosInput('enable');
          if (!respuesta) {
            this.snackbarService.mostrarMensaje('Ha ocurrido un problema, verifique e intente de nuevo');
            if (!environment.production) {
              console.log(respuesta);
            }
          } else {
            this.correoEnviado = true;
          }
        },
        (error) => {
          this.iniciarLlamadaBackend = false;
          this.habilitarDesabilitarTodosInput('enable');
          this.snackbarService.mostrarMensaje('No es posible realizar el proceso con los datos suministrados.');
          if (!environment.production) {
            console.log(error);
          }
        },
      );
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
