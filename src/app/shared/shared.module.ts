import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { DebitoCreditoComponent } from './debito-credito/debito-credito.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WaitingComponent } from './waiting/waiting.component';
import { CronometroDecrementoComponent } from './cronometro-decremento/cronometro-decremento.component';
import { InfodialogComponent } from './infodialog/infodialog.component';
import { ErrordialogComponent } from './errordialog/errordialog.component';
import { MatButtonModule } from '@angular/material/button';
import { SnackerrordialogComponent } from './snackerrordialog/snackerrordialog.component';
import { MessagesComponent } from './messages/messages.component';
import { DialogComponent } from './dialog/dialog.component';
import { DiscountUnregisteredComponent } from './discount-unregistered/discount-unregistered.component';
import { DirectivasModule } from '../directivas/directivas.module';
import { AlertNoLetOpenWindowComponent } from './alert-no-let-open-window/alert-no-let-open-window.component';


@NgModule({
  declarations: [
    ConfirmComponent, DebitoCreditoComponent,
    WaitingComponent, CronometroDecrementoComponent, InfodialogComponent, ErrordialogComponent, SnackerrordialogComponent, MessagesComponent, DialogComponent, DiscountUnregisteredComponent, AlertNoLetOpenWindowComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivasModule
  ],
  exports: [
    CronometroDecrementoComponent
  ]
})
export class SharedModule { }
