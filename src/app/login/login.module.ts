import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivasModule } from '../directivas/directivas.module';
import { DialogLoginBasicComponent } from './dialog-login-basic/dialog-login-basic.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ConfirmCerrarSesionComponent } from './confirm-cerrar-sesion/confirm-cerrar-sesion.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [LoginComponent, DialogLoginBasicComponent, ConfirmCerrarSesionComponent],
  // providers: [RutValidator],
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    // MatButton
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivasModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    MatIcon,
  ]
})
export class LoginModule { }
