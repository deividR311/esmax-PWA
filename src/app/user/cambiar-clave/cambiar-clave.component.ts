import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import Utils from '../../shared/Utils';
import { AuthService } from '../../services/auth.service';
import { MenuPrincipalService } from '../../services/menu-principal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.css']
})
export class CambiarClaveComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public hide = true;
  public iniciarLlamadaBackend = false;
  public rut = '';
  public usuario: any;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder, private userService: UserService,
    private menuPrincipalService: MenuPrincipalService,
    private router: Router
    ) {
      this.menuPrincipalService.mostrarBotonHamburguesa(false);
    }

  ngOnInit(): void {
    this.cargarControles();
  }
  cargarControles(): void {
    try {
      const usuario = Utils.currentUserFromStorage();
      if (usuario === null || usuario?.rut === '') {
        this.authService.doLogout();
        return;
      }
      this.usuario = usuario;
      this.rut = usuario?.rut;
      this.form = this.fb.group({
        clave:        ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]*$')]],
        nuevaClave:   ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]*$')]],
        confirmClave: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]*$')]],
      }, { validator: this.mustMatch('nuevaClave', 'confirmClave') });
    } catch (error) {
      this.authService.doLogout();
    }
  }
  mustMatch(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  /*cerrar(): void {
    this.dialogRef.close(false);
  }*/
  hasRutError = (controlName: string, errorName: string) => {
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

  cambiarClave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.iniciarLlamadaBackend = true;
    const password = this.form.controls.clave.value;
    const newpassword = this.form.controls.nuevaClave.value;
    this.habilitarDesabilitarTodosInput('disable');
    this.userService.cambiarPassword(this.rut, password, newpassword).subscribe(
      (respuesta: any) => {
        this.iniciarLlamadaBackend = false;
        this.habilitarDesabilitarTodosInput('enable');
        if (respuesta === 'Password modificado correctamente') {
          this.router.navigate(['/user/listoPass']);
        } else {
          // this.snackbarService.mostrarMensaje('Ha ocurrido un problema, verifique e intente de nuevo');
        }
      },
      (err) => {
        this.iniciarLlamadaBackend = false;
        this.habilitarDesabilitarTodosInput('enable');
        console.log('Password invalido');
        this.form.controls.clave.setErrors({'claveIncorrecta':true});
        // console.log(err);
      }
    );
    /* */
  }

  ngOnDestroy(): void {
    this.menuPrincipalService.mostrarBotonHamburguesa(true);
  }

}
