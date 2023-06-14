import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RutValidator } from '../../validaciones/rut.validator';
import { AuthService } from 'src/app/services/auth.service';
import { OrdenService } from 'src/app/services/orden.service';
import Utils from 'src/app/shared/Utils';
import { EessService } from '../../services/eess.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  formLogin!: FormGroup;
  returnUrl = '/seleccion';
  showAlert = false;
  hasCredentialError = false;
  iniciarLlamadaBackend = false;

  user: any = Object;

  constructor(
    private fb: FormBuilder, private authService: AuthService,
    private ordenService: OrdenService, // private route: ActivatedRoute,
    private eessService: EessService, private router: Router) { }

  ngOnInit(): void {
    this.iniciarLlamadaBackend = false;
    this.formLogin = this.fb.group({
      usuario: ['', [Validators.required, RutValidator()]],
      clave: ['', [Validators.required]]
    });

    // check initial conditions
    this.showAlert = false;
    if (!this.ordenService.getOrden().qr) {
      const cartQR = this.ordenService.getCartQRfromStorage();
      if (cartQR) {
        this.ordenService.orden.qr = cartQR;
        this.eessService.getEessData(cartQR).subscribe((data) => {
          if (data) {
            this.ordenService.setInitialData(data, cartQR);
          }
        });
      }
    }
    this.ordenService.check().subscribe(x => {
      if (!x) {
        this.showAlert = true;
      }
    });
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  login(): void {
    // const dv = Utils.getCheckDigit(this.formLogin.get('usuario')?.value);
    if (this.formLogin.invalid) {
      return;
    }

    this.iniciarLlamadaBackend = true;
  
    
    if (!localStorage.getItem(`${environment.cartQR}`)) { // login sin QR ------------

      this.authService.loginNoQr(
        this.formLogin.get('usuario')?.value,
        this.formLogin.get('clave')?.value).subscribe(x => {
          this.iniciarLlamadaBackend = false;
          this.router.navigate(['/user/home']);

        }, err => {
          this.iniciarLlamadaBackend = false;
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
                  this.hasCredentialError = true;
                  this.formLogin.controls.clave.setErrors({ hasCredentialError: true });
                  break;
              }
            }
          } else {
            console.log('Ocurrio un error en el servicio: ', err);
          }
        });



    } else { // con QR --------------------------------------------------------------------
      this.authService.signInWithOrder(
        this.formLogin.get('usuario')?.value,
        this.formLogin.get('clave')?.value,
        this.ordenService.orden).subscribe(x => {
          this.iniciarLlamadaBackend = false;
          // console.log('persona aquí ', x);
          this.router.navigate([this.returnUrl]);

        }, err => {
          this.iniciarLlamadaBackend = false;
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
                  this.hasCredentialError = true;
                  this.formLogin.controls.clave.setErrors({ hasCredentialError: true });
                  break;
              }
            }
          } else {
            console.log('Ocurrio un error en el servicio: ', err);
          }
        });
    }

  }


  hasRutError = (controlName: string, errorName: string) => {
    return this.formLogin.controls[controlName]?.hasError(errorName);
  }

  olvidasteClave(): void {
    this.router.navigate(['/recuperarClave']);
  }


}
