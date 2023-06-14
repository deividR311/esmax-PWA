import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-otro-monto',
  templateUrl: './dialog-otro-monto.component.html',
  styleUrls: ['./dialog-otro-monto.component.css']
})
export class DialogOtroMontoComponent implements OnInit {
  public form!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogOtroMontoComponent>, private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.crearControles();
  }
  crearControles(): void {
    this.form = this.fb.group({
      otro_monto:  ['', [Validators.required]],
    });
  }
  cerrar(respuesta = null): void {
    this.dialogRef.close(respuesta);
  }
}
