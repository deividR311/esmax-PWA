import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SnackerrordialogComponent } from '../shared/snackerrordialog/snackerrordialog.component';
import { SMX_ERROR } from '../model/ErrorsTypes';
import { MessagesComponent } from '../shared/messages/messages.component';
import { MENSAJES } from '../model/Mensajes';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar) { }

  mostrarMensaje(texto: string, action = ''){
    this._snackBar.open(texto, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration:2000,
    });
  }

  mostrarErrorType(index: number){
    
    const smxerror = SMX_ERROR[index];
    if (!smxerror) {
      console.log('Error no tipificado [' + index + ']');
      return;
    }
    
    this._snackBar.openFromComponent(SnackerrordialogComponent, {
      data: smxerror,
      duration: 10000,
      panelClass: ['fondo-snackbar']
    });
  }

  mostrarMessageType(mensaje: {contenido: string; clase: string; icono: string; }): void {
    if (!mensaje) {
      console.log('Error no tipificado');
      return;
    }
    this._snackBar.openFromComponent(MessagesComponent, {
      data: mensaje,
      duration: 10000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-message-content', mensaje.clase]
    });
  }

}
