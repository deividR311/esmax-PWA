import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { RutValidator } from '../../validaciones/rut.validator';
import { Router } from '@angular/router';
import { User } from '../../model/User';
import { SolicitudCodigoUsuario } from '../../model/SolicitudCodigoUsuario';
import { environment } from '../../../environments/environment.prod';
import { SolicitudCambioClave } from '../../model/SolicitudCambioClave';
import { RecuperarClaveService } from '../../services/recuperarClave.service';
import { MenuPrincipalService } from '../../services/menu-principal.service';
import { ErrordialogComponent } from '../../shared/errordialog/errordialog.component';
import { SMX_ERROR } from '../../model/ErrorsTypes';
import { MatDialog } from '@angular/material/dialog';
import { MENSAJES } from '../../model/Mensajes';
import { SnackbarService } from '../../services/snackbar.service';

export enum Secciones {
  INGRESA_RUT     = 0,
  ENVIO_DE_CODIGO = 1,
  NUEVA_CLAVE     = 2,
  LISTO           = 3
}
@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.component.html',
  styleUrls: ['./recuperar-clave.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecuperarClaveComponent implements OnInit, OnDestroy {
  public formConsultaRut!: FormGroup;
  public formEnviarCodigo!: FormGroup;
  public formNuevaClave!: FormGroup;

  public step = 0;
  public hide = true;
  public secciones = Secciones;
  public user!: User;
  public rutNoEncontrado      =  false;
  public codigosNoCoinciden   =  false;
  public codigoNoEnviado      =  false;
  public mostrarCrono         =  false;
  public iniciarLlamadaBackend = false;

  @ViewChild('stepper', { static: true }) stepper!: MatStepper;

  constructor(
    private fb: FormBuilder, private snackbarService: SnackbarService,
    private router: Router, private recuperarClaveService: RecuperarClaveService,
    private menuPrincipalService: MenuPrincipalService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.iniciarLlamadaBackend = false;
    this.crearControles();
    // this.stepper.selectedIndex = 3;
  }

  crearControles(): void {
    this.formConsultaRut = this.fb.group({
      rut: ['', [Validators.required, RutValidator() ]],
    });

    this.formEnviarCodigo = this.fb.group({
      opcion_envio: ['MAIL', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });

    this.formNuevaClave = this.fb.group({
      codigo_verificacion: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*$') ]],
      clave: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]*$')]],
      clave2: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]*$')]],
    }, { validator: this.mustMatch('clave', 'clave2') });
  }

  hasRutError = (controlName: string, errorName: string) => {
    return this.formConsultaRut.controls[controlName]?.hasError(errorName);
  }
  mustMatch(controlName: string, matchingControlName: string): any {
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

  consultarRut(): void {
    if (this.formConsultaRut.valid) {
      const rut = this.formConsultaRut.controls['rut'].value.trim();
      this.iniciarLlamadaBackend = true;
      this.recuperarClaveService.getUsuario(rut).subscribe((data: any | User) => {
        this.iniciarLlamadaBackend = false;
        if (data) {
          this.user = data;

          this.goAhed(this.secciones.ENVIO_DE_CODIGO);
        } else {
          this.rutNoEncontrado = true;
        }
      },
      (error) => {
        if (!environment.production) {
          console.log(error);
        }
        this.iniciarLlamadaBackend = false;
      });


      // llamar al servicio
    }
  }

  cambiarClave(): void {
    const solicitudCambioClave: SolicitudCambioClave = {
      codigo:         this.formNuevaClave.controls['codigo_verificacion'].value,
      rut:            this.user.rut,
      newpassword:    this.formNuevaClave.controls['clave'].value,
      verifypassword: this.formNuevaClave.controls['clave2'].value,

    };
    this.iniciarLlamadaBackend = true;
    this.recuperarClaveService.restaurarClave(solicitudCambioClave).subscribe((data) => {
      this.iniciarLlamadaBackend = false;
      if (data === 'El password ha sido modificado exitosamente.' ) {
        this.goAhed(this.secciones.LISTO);
        this.menuPrincipalService.mostrarBotonAtras(false);
      } else if (data === 'El codigo ha expirado') {
        this.snackbarService.mostrarMessageType(MENSAJES.EL_CODIGO_INGRESADO_EXPIRADO );
      } else if (data === null) {
        // this.codigosNoCoinciden = true;
        this.snackbarService.mostrarMessageType(MENSAJES.EL_CODIGO_INGRESADO_NO_COINCIDE );
      }
    },
    (error) => {
      if (!environment.production) {
        console.log(error);
      }
      this.iniciarLlamadaBackend = false;
    });

  }
  enviarCodigo(reenvio = false): void {
    const verifyoption = (this.formEnviarCodigo.controls['opcion_envio'].value === 'MAIL') ? 'EMAIL' : 'SMS';
    const solicitudCodigoUsuario: SolicitudCodigoUsuario = {
      rut: this.user.rut,
      verifyoption,
      expiresin: environment.chalengeExpiresin
    };
    this.iniciarLlamadaBackend = true;
    this.recuperarClaveService.enviarCodigoRestaurarClave(solicitudCodigoUsuario).subscribe((data) => {
      this.iniciarLlamadaBackend = false;
      if (!data) {
        const codigoError = (verifyoption === 'EMAIL') ? 6 : 4;
        this.showErrorDialog(codigoError);
        return;
      }
      this.mostrarCrono = false;
      this.mostrarCrono = true;
      if (reenvio && verifyoption === 'EMAIL') {
        this.snackbarService.mostrarMessageType(MENSAJES.SE_ENVIO_CODIGO_A_CORREO );
      }
      this.goAhed(this.secciones.NUEVA_CLAVE);
        // this.codigoNoEnviado = true;
    },
    (error) => {
      if (!environment.production) {
        console.log(error);
      }
      this.iniciarLlamadaBackend = false;
    });
  }
  iniciarSesion(): void {
      this.router.navigate(['/login']);
  }

  goAhed(paso: number): void {
    this.stepper.selectedIndex = paso;
    this.step = paso;
  }

  changeMode(type: string): void {
    this.formEnviarCodigo.controls['opcion_envio'].setValue(type);
    // controla si muestra el mensaje de codigo enviado o no
    this.codigoNoEnviado =  false;
  }

  /* ----------------- Navegación Hitorial---------------------------------*/
  componentRegistroBackAction(): boolean {
    // console.log('this.localStepper.selectedIndex', this.stepper.selectedIndex);
    if (this.stepper.selectedIndex === 0) {
      return true;
    } else {
      this.stepper.previous();
      // this.formRegisterA.markAllAsTouched();
      this.step = this.stepper.selectedIndex;
      return false;
    }
  }
  showErrorDialog(index: number): void {
    const smxerror = SMX_ERROR[index];
    if (!smxerror) {
      console.log('Error no tipificado [' + index + ']');
      return;
    }
    const dialogRef = this.dialog.open(ErrordialogComponent, {
      panelClass: 'error-dialog-wrapper',
      // position: { bottom: '0px' },
      // width: '250px',
      data: { errorType: smxerror }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
    });

  }
  finalizoCronometro(): void{
    this.mostrarCrono = false;
  }
  ngOnDestroy(): void {
    this.menuPrincipalService.mostrarBotonAtras(true);
  }
}
