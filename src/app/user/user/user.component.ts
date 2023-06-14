import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Comuna } from 'src/app/model/Comuna';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/services/auth.service';
import { ComunaService } from 'src/app/services/comuna.service';
import { RegistroService } from 'src/app/services/registro.service';
import { DatePipe } from '@angular/common';
import Utils from 'src/app/shared/Utils';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CUSTOM_DATE_FORMAT } from 'src/app/shared/custom-date-format';
import { environment } from '@env/environment';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { RutDirective } from '../../directivas/rut.directive';
import { MENSAJES } from '../../model/Mensajes';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'cl-CL' }
  ]
})
export class UserComponent implements OnInit {

  formUser!: FormGroup;
  sample: any;
  comunasList!: Comuna[];
  filteredComunas: Observable<Comuna[]> | undefined;
  currentUser!: User | null;
  iniciarLlamadaBackend = false;
  maxDate!: Date;
  minDate!: Date;
  @ViewChildren(RutDirective) dirs?: any;

  constructor(private fb: FormBuilder, private comunaService: ComunaService,
              private registroService: RegistroService, private authService: AuthService,
              private datePipe: DatePipe, public dialog: MatDialog,
              private snackbarService: SnackbarService, private router: Router) { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 110);
    // coloco este bloque ya que noto que si no hay token no redirecciona a fin, solo muestra los input vacios
    try {
      Utils.currentUserFromStorage();
    } catch (error) {
      this.authService.doLogout();
    }
    this.formUser = this.fb.group({
      nombre: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('[a-zA-Z ]{1,99}')]],
      apellido: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('[a-zA-Z ]{1,99}')]],
      run: [{ value: '', disabled: true }],
      email: [{ value: '', readonly: true }],
      celular: [{ value: '', }, [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[0-9]*$') ]],
      fecha: [{ value: '', disabled: false }],
      comuna: [{ value: '', disabled: false }],
      genero: [{ value: '', disabled: false }]
    });

    this.updateData();

    this.getComunas();

    this.filteredComunas = this.formUser.get('comuna')?.valueChanges.pipe(
      startWith(''),
      map(
        (value => this._filterComunas(value))
      )
      // map(employee => employee ? this._filterComunas(employee) : this.comunasList.slice())
    );
  }
  removerDobleEspacio(input: string): void{
    this.formUser.controls[input].setValue(this.formUser.controls[input].value.replace(/  +/g, ' ').trimStart());
  }


  updateData(): void {
    this.currentUser = Utils.currentUserFromStorage();

    if (this.currentUser === null || this.currentUser?.rut === '') {
      console.log('No es posible continuar si no hay un usuario.');
      this.authService.doLogout();
    }

    let fechaAsDate = null;
    if (this.currentUser?.fechanacimiento && this.currentUser?.fechanacimiento !== 'Invalid date') {
      fechaAsDate = Utils.stringToDate(this.currentUser?.fechanacimiento);
    }
    const celular = this.currentUser?.telefono || '';
    this.formUser.patchValue({
      run: this.currentUser?.rut,
      email: this.currentUser?.email,
      celular: celular.replace('+569', ''),
      nombre: this.currentUser?.nombres,
      apellido: this.currentUser?.apellidos,
      fecha: fechaAsDate, // 1971 03 02
      comuna: this.currentUser?.comuna,
      genero: this.currentUser?.genero?.toUpperCase() // 'MASCULINO'
    });
  }
  habilitarDesabilitarTodosInput(accion: string): void {
    Object.keys(this.formUser.controls).forEach(key => {
      if (accion === 'disable') {
        this.formUser.controls[key].disable();
      } else{
        this.formUser.controls[key].enable();
      }
    });
  }
  saveData(): void {
    this.formUser.controls['nombre'].setValue(this.formUser.controls['nombre'].value.trim());
    this.formUser.controls['apellido'].setValue(this.formUser.controls['apellido'].value.trim());
    this.formUser.controls['comuna'].setValue(this.formUser.controls['comuna'].value.trim());
    if (!this.formUser.valid) {
      return;
    }
    const user: any = {
      rut: this.currentUser?.rut + '',
      // tipousuario: 'PERSONA',
      // password: user.password,
      telefono: '+569' + this.formUser.controls.celular.value,
      telefonovalidado: 'SI',
      // email: user.email,
      // emailvalidado: user.emailvalidado,
      comuna: this.formUser.controls.comuna.value,
      nombres: this.formUser.controls.nombre.value,
      apellidos: this.formUser.controls.apellido.value,
      genero: this.formUser.controls.genero.value,
      // fechanacimiento: this.currentUser?.fechanacimiento,
    };

    if (this.currentUser?.fechanacimiento) {
      user.fechanacimiento = this.datePipe.transform(this.formUser.controls.fecha.value, 'yyyyMMdd');
    }
    this.iniciarLlamadaBackend = true;
    this.habilitarDesabilitarTodosInput('disable');
    this.registroService.updateUsuario(user).subscribe(x => {
      this.iniciarLlamadaBackend = false;
      this.habilitarDesabilitarTodosInput('enable');
      if (!environment.production) {
        console.log('Result updateData user: ', x);
      }
      if (x.newjwttoken.tokenjwt){
        Utils.jwtToUserToStorage(x.newjwttoken.tokenjwt);
        this.updateData();
        this.dirs?.first?.ngAfterViewInit();
        this.snackbarService.mostrarMessageType(MENSAJES.SE_ACTUALIZO_TU_USUARIO);
      } else {
        this.snackbarService.mostrarMensaje('Hubo un problema atualizando los datos del usuario');
      }


    }, err => {
      this.iniciarLlamadaBackend = false;
      this.snackbarService.mostrarMensaje('Hubo problemas con la actualización.');
      console.log('Error no es posible acceder al servicio', err);
    });
  }





  /***************** */
  hasError = (controlName: string, errorName: string) => {
    return this.formUser.controls[controlName]?.hasError(errorName);
  }


  getComunas(): void {
    this.comunaService.getComunas()
      .subscribe(response => {
        this.comunasList = response;
        this.formUser.markAllAsTouched();
        // console.log('respiesta', response);
      });
  }
  private _filterComunas(value: string): Comuna[] {
    const filterValue = value.toLowerCase();
    if (this.comunasList) {
      return this.comunasList.filter(comuna => comuna.nombre.toLowerCase().indexOf(filterValue) === 0);
    }
    return this.comunasList;
  }
  changePass(): void {
    this.router.navigate(['/user/editarClave']);
  }

  irEditarCorreo(): void {
    this.router.navigate(['/user/editarCorreo']);
  }

}
