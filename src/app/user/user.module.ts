import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserComponent } from './user/user.component';
import { TransbankComponent } from './transbank/transbank.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CambiarCorreoComponent } from './cambiar-correo/cambiar-correo.component';
import { ValidarCorreoComponent } from './validar-correo/validar-correo.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListoComponent } from './listo/listo.component';
import { SharedModule } from '../shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { DirectivasModule } from '../directivas/directivas.module';
import { CambiarClaveComponent } from './cambiar-clave/cambiar-clave.component';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    UserComponent, TransbankComponent,
    CambiarCorreoComponent, ValidarCorreoComponent, ListoComponent, CambiarClaveComponent, HomeComponent],
  imports: [
    CommonModule,


    CommonModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatButton
    MatButtonModule,
    // MatStepperModule,
    // MaterialModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    SharedModule,
    MatGridListModule,
    DirectivasModule
  ],
  providers: [DatePipe]
})
export class UserModule { }
