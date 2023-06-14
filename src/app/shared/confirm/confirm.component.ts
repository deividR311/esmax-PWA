import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  pregunta = '';
  textoBotonCancelar = '';
  textoBotonAceptar = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmComponent>) { }

  ngOnInit(): void {
    this.pregunta = this.data?.pregunta;
    this.textoBotonAceptar = this.data?.textoBotonAceptar || 'Aceptar';
    this.textoBotonCancelar = this.data?.textoBotonCancelar || 'Cancelar';
  }
  cerrar(respuesta: boolean): void {
    this.dialogRef.close(respuesta);
  }

}
