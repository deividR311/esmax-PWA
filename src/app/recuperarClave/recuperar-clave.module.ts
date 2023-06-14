import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecuperarClaveComponent } from './recuperar-clave/recuperar-clave.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivasModule } from '../directivas/directivas.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [RecuperarClaveComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    // MatButton
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivasModule,
    MatIconModule,
    SharedModule,
    MatProgressSpinnerModule,
  ],
  providers:[
    MatIcon,
  ]
})
export class RecuperarClaveModule { }
