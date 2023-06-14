import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluaExperienciaComponent } from './evalua-experiencia/evalua-experiencia.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { MatGridListModule } from '@angular/material/grid-list';
@NgModule({
  declarations: [EvaluaExperienciaComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    // MatButton
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatGridListModule
  ],
  providers:[
    MatIcon,
  ]
})
export class EvaluaExperienciaModule { }
