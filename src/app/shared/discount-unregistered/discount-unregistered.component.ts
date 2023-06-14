import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import { RutValidator } from 'src/app/validaciones/rut.validator';

@Component({
  selector: 'app-discount-unregistered',
  templateUrl: './discount-unregistered.component.html',
  styleUrls: ['./discount-unregistered.component.css']
})
export class DiscountUnregisteredComponent implements OnInit {
  
  public formLogin!: FormGroup;
  public onAdd = new EventEmitter();
  public discounts = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DiscountUnregisteredComponent>, private fb: FormBuilder) { 
    this.formLogin = this.fb.group({
      usuario: ['', [Validators.required, RutValidator()]]
    });
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  hasRutError = (controlName: string, errorName: string) => {
    return this.formLogin.controls[controlName]?.hasError(errorName);
  }

  verificar() : void {
    if (this.formLogin.invalid) {
      return;
    }
    this.formLogin.get('usuario').setErrors(null);
    this.onAdd.emit(this.formLogin.get('usuario').value);
    sessionStorage.setItem("usermodal", this.formLogin.get('usuario').value);
  }

  closeDialogNotDiscount() : void {
    this.dialogRef.close("not");
  }
}