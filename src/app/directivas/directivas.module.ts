import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutDirective } from './rut.directive';


@NgModule({
  declarations: [
    RutDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RutDirective,
  ]
})
export class DirectivasModule { }
