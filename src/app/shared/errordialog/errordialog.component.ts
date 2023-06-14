import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IError } from 'src/app/model/ErrorsTypes';

@Component({
  selector: 'app-errordialog',
  templateUrl: './errordialog.component.html',
  styleUrls: ['./errordialog.component.css']
})
export class ErrordialogComponent implements OnInit {

  showAlertErrorTitle = '';
  showAlertErrorMessage = '';
  error: IError | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ErrordialogComponent>) { }

  ngOnInit(): void {
    this.error = this.data.errorType as IError;
    this.showAlertErrorTitle = this.error?.title;
    this.showAlertErrorMessage = this.error?.msg;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}
