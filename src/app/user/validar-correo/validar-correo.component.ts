import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidarCorreoService } from 'src/app/services/validarCorreo.service';
import { Router } from '@angular/router';
import { SolicitudCodigoCambioCorreo } from '../../model/SolicitudCodigoCambioCorreo';
import { SolicitudCambioCorreo } from '../../model/SolicitudCambioCorreo';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import Utils from '../../shared/Utils';
import { MenuPrincipalService } from '../../services/menu-principal.service';
import { MENSAJES } from '../../model/Mensajes';

@Component({
  selector: 'app-validar-correo',
  templateUrl: './validar-correo.component.html',
  styleUrls: ['./validar-correo.component.css']
})
export class ValidarCorreoComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public email: string | undefined = '';
  public solicitudCodigoCambioCorreo?: SolicitudCodigoCambioCorreo;
  public codigosNoCoinciden   =  false;
  public codigoNoEnviado      =  false;
  public mostrarCrono         =  true;
  public iniciarLlamadaBackend = false;
  public iniciarLlamadaBackendReenviarCodigo = false;

  constructor(
    private fb: FormBuilder, private router: Router,
    private validarCorreoService: ValidarCorreoService, private userService: UserService,
    private authService: AuthService, private snackbarService: SnackbarService,
    private menuPrincipalService: MenuPrincipalService) {
      this.menuPrincipalService.mostrarBotonHamburguesa(false);
    }

  ngOnInit(): void {
    this.solicitudCodigoCambioCorreo = this.validarCorreoService.getSolicitudCodigoCambioCorreo();
    const newemail = this.solicitudCodigoCambioCorreo?.newemail;
    
    if(!newemail) {
      this.router.navigate(['/user/editarCorreo']);
    }
    this.email = newemail;
    this.crearControles();
  }
  crearControles(): void {
      this.form = this.fb.group({
        mail :                [this.email, [Validators.required, Validators.email]],
        codigo_verificacion:  ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[0-9]*$') ]],
      });
  }
  guardar(): void {
    this.iniciarLlamadaBackend = true;
    this.habilitarDesabilitarTodosInput('disable');
    const solicitudCambioCorreo:SolicitudCambioCorreo = {
      codigo: this.form.controls['codigo_verificacion'].value,
      newemail: this.email,
      rut: this.solicitudCodigoCambioCorreo?.rut
    };
    this.userService.cambiarCorreo(solicitudCambioCorreo).subscribe((data)=>{
      this.iniciarLlamadaBackend = false;
      this.habilitarDesabilitarTodosInput('enable');
      if (data === 'error Los codigos no coinciden' || data === 'Los codigos no coinciden' ) {
        // this.codigosNoCoinciden = true;
        this.snackbarService.mostrarMessageType(MENSAJES.EL_CODIGO_INGRESADO_NO_COINCIDE );
      } else if (data === 'El codigo ha expirado') {
        this.snackbarService.mostrarMessageType(MENSAJES.EL_CODIGO_INGRESADO_EXPIRADO );
      } else {
        if (data?.newjwttoken) {
          Utils.jwtToUserToStorage(data?.newjwttoken);
          this.validarCorreoService.limpiarCorreo();
          this.router.navigate(['/user/listo']);
        } else {
          this.snackbarService.mostrarMensaje('Hubo un problema atualizando el correo electronico del usuario');
        }
      }
    },
    error => {
      this.snackbarService.mostrarMensaje('Ha ocurrido un problema');
      this.iniciarLlamadaBackend = false;
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

  enviarCodigo(): void {
    this.iniciarLlamadaBackendReenviarCodigo = true;
    this.habilitarDesabilitarTodosInput('disable');
    this.userService.solicitarCodigoParaCambiarCorreo(this.solicitudCodigoCambioCorreo).subscribe((data) => {
      this.iniciarLlamadaBackendReenviarCodigo = false;
      this.habilitarDesabilitarTodosInput('enable');

      if (data?.message === 'OK' || data === 'Se ha enviado el codigo') {
        this.snackbarService.mostrarMessageType(MENSAJES.SE_ENVIO_CODIGO_A_CORREO );
      } else {
        this.snackbarService.mostrarMensaje('Ha ocurrido un problema'); console.log(data);
      }
    },
    (error)=>{
      this.iniciarLlamadaBackendReenviarCodigo = false;
      this.habilitarDesabilitarTodosInput('enable');
      this.snackbarService.mostrarMensaje('Ha ocurrido un problema');
      }
    );
  }
  finalizoCronometro(): void{
    this.mostrarCrono = false;
  }
  ngOnDestroy(): void {
    this.menuPrincipalService.mostrarBotonHamburguesa(true);
  }
}
