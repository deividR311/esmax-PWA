import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-cerrar-sesion',
  templateUrl: './confirm-cerrar-sesion.component.html',
  styleUrls: ['./confirm-cerrar-sesion.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmCerrarSesionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmCerrarSesionComponent>) { }

  ngOnInit(): void {
  }
  cerrar(respuesta:boolean):void{
    this.dialogRef.close(respuesta);
  }
}
