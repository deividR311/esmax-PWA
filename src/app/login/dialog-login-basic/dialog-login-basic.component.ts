import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RutValidator } from '../../validaciones/rut.validator';
import { AuthService } from 'src/app/services/auth.service';
import { OrdenService } from 'src/app/services/orden.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-login-basic',
  templateUrl: './dialog-login-basic.component.html',
  styleUrls: ['./dialog-login-basic.component.css']
})
export class DialogLoginBasicComponent implements OnInit {
  public form!: FormGroup;
  public hide = true;
  public iniciarLlamadaBackend = false;
  constructor(
    public dialogRef: MatDialogRef<DialogLoginBasicComponent>,
    private fb: FormBuilder, private authService: AuthService,
    private ordenService: OrdenService,
    @Inject(MAT_DIALOG_DATA) public data: { medioPago: string }
  ) { }

  ngOnInit(): void {
    this.cargarControles();
    this.chequearOrden();
  }

  cargarControles(): void {
    this.form = this.fb.group({
      usuario: ['', [Validators.required, RutValidator()]],
      clave: ['', [Validators.required]]
    });
  }

  chequearOrden(): void {
    // desconozco su funcionalidad pero como este componente debe ser una copia del anterior lo implemente
    this.ordenService.check().subscribe(x => {
      if (!x) {
        console.log('Error no existen condiciones <ordenService.check()>');
      }
    });
  }
  login(): void {
    this.iniciarLlamadaBackend =  true;
    this.form.disable();
    this.authService.signInWithOrder(
      this.form.get('usuario')?.value,
      this.form.get('clave')?.value,
      this.ordenService.orden).subscribe(x => {
        this.iniciarLlamadaBackend =  false;
        this.form.enable();
        this.dialogRef.close('ok');
      }, err => {
        this.iniciarLlamadaBackend =  false;
        this.form.enable();
        if (err instanceof HttpErrorResponse) {
          if (err.error instanceof ErrorEvent) {
            console.error('Error Event');
          } else {
            console.log(`Error status : ${err.status} ${err.statusText}`);
            switch (err.status) {
              case 401:      // login
                // this.router.navigateByUrl('/login');
                break;
              case 403:     // forbidden
                // this.router.navigateByUrl('/unauthorized');
                // this.hasCredentialError = true;
                this.form.controls.clave.setErrors({ error: true });
                break;
            }
          }
        } else {
          console.log('Ocurrio un error en el servicio: ', err);
        }
      }
      );

  }

  hasError = (controlName: string, errorName: string) => {
    return (this.form.invalid && this.form.dirty);
  }

  hasRutError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName]?.hasError(errorName);
  }
  registrate(): void {
    this.dialogRef.close('registro');
  }
  cerrar(): void {
    this.dialogRef.close('cerrado');
  }
}
