import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { HttpClient } from '@angular/common/http';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComunaService } from 'src/app/services/comuna.service';
import { Observable } from 'rxjs';
import { Comuna } from 'src/app/model/Comuna';
import { map, startWith } from 'rxjs/operators';
// @ts-ignore
import { RutValidator } from '../../validaciones/rut.validator';
import { MatDialog } from '@angular/material/dialog';
import { RegistroService } from 'src/app/services/registro.service';
import { DatePipe } from '@angular/common';
import { PoliticasComponent } from 'src/app/registro/politicas/politicas.component';
import { User } from 'src/app/model/User';
import { environment } from '@env/environment';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { CUSTOM_DATE_FORMAT } from 'src/app/shared/custom-date-format';
import { Router } from '@angular/router';
import { RecuperarClaveService } from 'src/app/services/recuperarClave.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ErrordialogComponent } from 'src/app/shared/errordialog/errordialog.component';
import { IError, SMX_ERROR } from 'src/app/model/ErrorsTypes';
import { MENSAJES } from '../../model/Mensajes';
import { MenuPrincipalService } from '../../services/menu-principal.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'cl-CL' }
  ],
  encapsulation: ViewEncapsulation.None
})

export class RegistroComponent implements OnInit, OnDestroy {

  formRegisterA!: FormGroup;
  formRegisterB!: FormGroup;
  formRegisterC!: FormGroup;
  formRegisterD!: FormGroup;
  formRegisterE!: FormGroup;
  submitted = false;
  isEditable = false;
  comunasList!: Comuna[];
  filteredComunas: Observable<Comuna[]> | undefined;
  filteredOptions: any;
  // chalenge ---------------
  chalenge: any;
  isChalengeSMS = false;
  telefonovalidado = 'NO';
  emailvalidado = 'SI';
  // ------------------------
  maxDate!: Date;
  atDate!: Date;
  // ------------------------
  step = 0;
  hide = true;

  // GP 18/03/2021
  isChallenged = false;
  time = 0;
  display: any;
  interval: any;
  isFinishOk = false;
  finishOkMsg1 = '';
  finishOkMsg2 = '';
  mostrarCrono = false;
  validandoRut = false;
  rutYaRegistrado = false;
  codigosExpirados = new Set();


  constructor(
    private fb: FormBuilder, private comunaService: ComunaService, private router: Router,
    public dialog: MatDialog, private datePipe: DatePipe,
    private registroService: RegistroService, public httpClient: HttpClient,
    private recuperarClaveService: RecuperarClaveService,
    private snackbarService: SnackbarService, private menuPrincipalService: MenuPrincipalService,
  ) { }

  @ViewChild('stepper', { static: true }) stepper!: MatStepper;

  ngOnInit(): void {
    this.formRegisterA = this.fb.group({
      run: ['', [Validators.required, RutValidator() ]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // email2: ['', [Validators.required, Validators.email]],
      email2: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      celular: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.mustMatch('email', 'email2') });

    this.formRegisterB = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{1,99}')]],
      apellido: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{1,99}')]],
      genero: [''],
      fecha: [''],
      comuna: ['']
    });

    this.formRegisterC = this.fb.group({
      clave: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]*$')]],
      clave2: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      privacyCheck: ['', [Validators.requiredTrue]]
    }, { validator: this.mustMatch('clave', 'clave2') });

    this.formRegisterD = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(4), Validators.minLength(4)]]
    });

    this.formRegisterE = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(6)]]
    });

    this.getComunas();

    this.filteredComunas = this.formRegisterB.get('comuna')?.valueChanges.pipe(
      startWith(''),
      map(
        (value => this._filterComunas(value))
      )
      // map(employee => employee ? this._filterComunas(employee) : this.comunasList.slice())
    );

    // const currentYear = new Date().getFullYear();
    // this.minDate = new Date(currentYear - 117, 0, 1);
    // this.maxDate = new Date(currentYear - 17, 11, 31);

    this.atDate = new Date();
    this.atDate.setFullYear(this.atDate.getFullYear() - 20);

    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

    // this.stepper.selectedIndex = 1;
    // this.step = 1;
  }

  private _filterComunas(value: string): Comuna[] {
    const filterValue = value.toLowerCase();
    if (this.comunasList) {
      return this.comunasList.filter(comuna => comuna.nombre.toLowerCase().indexOf(filterValue) === 0);
    }
    return this.comunasList;
  }

  goAhed(paso: number): void {
    this.stepper.selectedIndex = paso;
    this.step = paso;
    this.menuPrincipalService.mostrarBotonAtras( (paso !== 5) );
    if (paso === 4) {
      this.sendCode();
    }
  }
  validarRut(): void {
    this.validandoRut = true;
    const runstring = 'run';
    const run = this.formRegisterA.controls[runstring].value;
    this.recuperarClaveService.getUsuario(run).subscribe((respuesta) => {
      this.validandoRut = false;
      if (respuesta === null) {
        this.goAhed(1);
      } else{
        this.rutYaRegistrado = true;
      }
    });
  }

  getComunas(): void {
    this.comunaService.getComunas()
      .subscribe(response => {
        this.comunasList = response;
        // console.log('respiesta', response);
      });
  }

  // custom validator to check that two fields match
  // tslint:disable-next-line:typedef
  mustMatch(controlName: string, matchingControlName: string) {
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
    return this.formRegisterA.controls[controlName]?.hasError(errorName);
  }
  hasErrorB = (controlName: string, errorName: string) => {
    return this.formRegisterB.controls[controlName]?.hasError(errorName);
  }
  hasErrorC = (controlName: string, errorName: string) => {
    return this.formRegisterC.controls[controlName]?.hasError(errorName);
  }
  hasErrorD = (controlName: string, errorName: string) => {
    return this.formRegisterD.controls[controlName]?.hasError(errorName);
  }

  // tslint:disable-next-line:typedef
  get f() { return this.formRegisterA.controls; }
  // tslint:disable-next-line:typedef
  get ff() { return this.formRegisterB.controls; }
  // tslint:disable-next-line:typedef
  get fff() { return this.formRegisterC.controls; }
  // tslint:disable-next-line:typedef
  get codeCompare() { return this.formRegisterD.controls; }
  // tslint:disable-next-line:typedef
  get validationCode() { return this.chalenge; }


  setSMSChalenge(isSMS: boolean): void {
    if (isSMS) {
      this.isChalengeSMS = true;
      this.telefonovalidado = 'SI';
      this.emailvalidado = 'NO';
    } else {
      this.isChalengeSMS = false;
      this.telefonovalidado = 'NO';
      this.emailvalidado = 'SI';
    }
  }



  openDialog(): void {
    this.dialog.open(PoliticasComponent, {
      autoFocus: false,
      maxHeight: '90vh' // you can adjust the value as per your view
    });
  }





  validated(): void {

    this.datePipe.transform(this.formRegisterB.controls.fecha.value, 'yyyyMMdd');

    if (this.formRegisterD.controls.codigo.value !== this.chalenge.toString()) {
      // alert('El código no coincide, intente nuevamente.');
      this.snackbarService.mostrarMessageType(MENSAJES.EL_CODIGO_INGRESADO_NO_COINCIDE);
      return;

    } else {

      if (this.codigosExpirados.has(this.formRegisterD.controls.codigo.value) ) {
        this.snackbarService.mostrarMessageType(MENSAJES.EL_CODIGO_INGRESADO_EXPIRADO );
        return;
      }

      const user: User = {
        rut: this.formRegisterA.controls.run.value,
        tipousuario: 'PERSONA',
        password: this.formRegisterC.controls.clave.value,
        telefono: '+569' + this.formRegisterA.controls.celular.value,
        telefonovalidado: this.telefonovalidado,
        email: this.formRegisterA.controls.email.value,
        emailvalidado: this.emailvalidado,
        comuna: this.formRegisterB.controls.comuna.value,
        nombres: this.formRegisterB.controls.nombre.value,
        apellidos: this.formRegisterB.controls.apellido.value,
        genero: this.formRegisterB.controls.genero.value // ,
        // fechanacimiento: formatDate(this.formRegisterB.controls.fecha.value, 'yyyyMMdd', 'en-US'),
      };

      if (this.formRegisterB.controls.fecha.value) {
        user.fechanacimiento = this.datePipe.transform(this.formRegisterB.controls.fecha.value, 'yyyyMMdd') + '';
      }

      this.registroService.creaUsuario(user).subscribe(x => {
        if (!environment.production) {
          console.log('Respuesta de servicio: ', x);
        }

        // Utils.jsendHelper(x as ApiResponse);

        const result = x as ApiResponse;

        if (result?.status === 'success') {
          this.isFinishOk = true;
          this.finishOkMsg1 = '¡Listo!';
          this.finishOkMsg2 = 'Tu cuenta ha sido creada con éxito.';
        } else {
          this.isFinishOk = false;
          this.finishOkMsg1 = 'Error';
          this.finishOkMsg2 = result.message + '';
        }

        this.goAhed(5);

      }, err => {
        console.log('No es posible crear el usuario: ', err);
        alert('No es posible crear el usuario');
      });
    }




  }

  sendCode(reenvio = false): void {
    this.isChallenged = false;

    const paramatroSMS = '569' + this.formRegisterA.controls.celular.value;
    const paramatroMail = this.formRegisterA.controls.email.value;

    if (this.isChalengeSMS) { // ---------------------> envio sms

      this.registroService.getFonoChallenge(paramatroSMS).subscribe(x => {

        if (!x) {
          // 5-8 this.snackbarService.mostrarMensaje('Ocurrió un problema al enviar el SMS.');
          this.showErrorDialog(4);
        } else {
          if (!environment.production) {
            console.log('FonoChallenge: 417', x);
          }

          if (x.challenge) {
            this.isChallenged = true;
            this.chalenge = x.challenge;
            this.mostrarCrono = false;
            this.mostrarCrono = true;
          } else {
            this.display = 'error';
          }
        }

      }, err => {
        console.log('Error no es posible acceder al servicio', err);
      });

    } else { // -----------------------------------> envio email
      this.registroService.getEmailChallenge(paramatroMail).subscribe(x => {
        if (!x) {
          // 5-8 this.snackbarService.mostrarMensaje('Ocurrió un problema al enviar el EMAIL.');
          this.showErrorDialog(6);
        } else {

          this.isChallenged = true;
          this.chalenge = x.challenge;
          this.mostrarCrono = false;
          this.mostrarCrono = true;
          if (reenvio) {
            this.snackbarService.mostrarMessageType(MENSAJES.SE_ENVIO_CODIGO_A_CORREO );
          }

          if (!environment.production) {
            console.log('EmailChallenge: 273', x.challenge + '34');
          }
        }



      }, err => {
        console.log('Error no es posible acceder al servicio', err);
      });
    }

  }

  comencemos(): void {
    this.router.navigateByUrl('/login');
  }


  showErrorDialog(index: number): void {
    const smxerror = SMX_ERROR[index];
    if (!smxerror) {
      console.log('Error no tipificado [' + index + ']');
      return;
    }
    const dialogRef = this.dialog.open(ErrordialogComponent, {
      panelClass: 'error-dialog-wrapper',
      // width: '250px',
      data: { errorType: smxerror }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
    });

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

  finalizoCronometro(): void {
    this.mostrarCrono = false;
    this.codigosExpirados.add(this.chalenge);
  }

  ngOnDestroy(): void {
    this.menuPrincipalService.mostrarBotonAtras(true);
  }

}
