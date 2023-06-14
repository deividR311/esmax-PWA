import { Component, Inject, OnInit } from '@angular/core';
import {MatSnackBarRef, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import { IError } from 'src/app/model/ErrorsTypes';

@Component({
  selector: 'app-snackerrordialog',
  templateUrl: './snackerrordialog.component.html',
  styleUrls: ['./snackerrordialog.component.css']
})
export class SnackerrordialogComponent implements OnInit {

  showAlertErrorTitle: any;
  showAlertErrorMessage: any;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBarRef: MatSnackBarRef<SnackerrordialogComponent>) { }

  ngOnInit(): void {
    const error = this.data as IError;
    this.showAlertErrorTitle = error?.title;
    this.showAlertErrorMessage = error?.msg;
  }

  cerrar(): void {
    // this.dialogRef.close();
  }

}
