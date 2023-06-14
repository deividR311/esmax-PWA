import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ValidarCorreoService } from 'src/app/services/validarCorreo.service';
import Utils from 'src/app/shared/Utils';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment.prod';
import { SolicitudCodigoCambioCorreo } from 'src/app/model/SolicitudCodigoCambioCorreo';
import { SnackbarService } from '../../services/snackbar.service';
import { MenuPrincipalService } from '../../services/menu-principal.service';
// import { MENSAJES } from '../../model/Mensajes';

@Component({
  selector: 'app-cambiar-correo',
  templateUrl: './cambiar-correo.component.html',
  styleUrls: ['./cambiar-correo.component.css']
})
export class CambiarCorreoComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public usuario: any;
  public iniciarLlamadaBackend = false;

  constructor(
    private fb: FormBuilder, private router: Router,
    private authService: AuthService, private validarCorreoService: ValidarCorreoService,
    private userService: UserService, private snackbarService: SnackbarService,
    private menuPrincipalService: MenuPrincipalService) {
      this.menuPrincipalService.mostrarBotonHamburguesa(false);
    }

  ngOnInit(): void {
    this.crearControles();
  }
  crearControles(): void {
    try {
      const usuario = Utils.currentUserFromStorage();
      if (usuario === null || usuario?.rut === '') {
        this.authService.doLogout();
      }
      this.usuario = usuario;
      this.form = this.fb.group({
        rut :         [usuario?.rut, [Validators.required]],
        mail :        [usuario?.email, [Validators.required, Validators.email]],
        newMail:      ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.maxLength(60) ]],
        confirmMail:  ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      }, { validator: [this.mustMatch('newMail', 'confirmMail'), this.correoDiferenteAnteriorValidator('mail', 'newMail')] });
    } catch (error) {
      this.authService.doLogout();
    }
  }
  correoDiferenteAnteriorValidator(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.correoDiferenteAnterior) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      if (control.value === matchingControl.value) {
        matchingControl.setErrors({ correoDiferenteAnterior: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  mustMatch(controlName: string, matchingControlName: string): any  {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  hasErrorA = (controlName: string, errorName: string) => {
    return this.form.controls[controlName]?.hasError(errorName);
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
  siguiente(): void {
    if (this.form.valid) {
      // tslint:disable-next-line:no-string-literal
      const newemail  = this.form.controls['newMail']?.value;
      // tslint:disable-next-line:no-string-literal
      const rut       = this.form.controls['rut']?.value;
      const expiresin = environment.chalengeExpiresin;
      const solicitudCambioCorreo: SolicitudCodigoCambioCorreo = {newemail, rut, expiresin};
      this.iniciarLlamadaBackend = true;
      this.habilitarDesabilitarTodosInput('disable');
      this.userService.solicitarCodigoParaCambiarCorreo(solicitudCambioCorreo).subscribe((data) => {
        this.iniciarLlamadaBackend = false;
        this.habilitarDesabilitarTodosInput('enable');
        if (data?.message === 'OK' || data === 'Se ha enviado el codigo') {
          this.validarCorreoService.setSolicitudCodigoCambioCorreo(solicitudCambioCorreo );
          // this.snackbarService.mostrarMessageType(MENSAJES.SE_ENVIO_CODIGO_A_CORREO );
          this.router.navigate(['/user/validarCorreo']);
        } else {
          this.snackbarService.mostrarMensaje('Ha ocurrido un problema'); console.log(data);
        }
      },
      (error) => {
        this.iniciarLlamadaBackend = false;
        this.habilitarDesabilitarTodosInput('enable');
        this.snackbarService.mostrarMensaje('Ha ocurrido un problema');
      }
      );
    }
  }

  ajustarInput(input: string): void {
    this.form.controls[input].setValue(this.form.controls[input].value.trim().toLocaleLowerCase());
  }
  ngOnDestroy(): void {
    this.menuPrincipalService.mostrarBotonHamburguesa(true);
  }
}
