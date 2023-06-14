import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
@NgModule({
  declarations: [InicioComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MaterialModule,
    MatDialogModule,
    SharedModule
  ],
  providers: [
    MatIcon,
    MatDialogModule
  ]
})
export class InicioModule {}