import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-no-let-open-window',
  templateUrl: './alert-no-let-open-window.component.html',
  styleUrls: ['./alert-no-let-open-window.component.css']
})
export class AlertNoLetOpenWindowComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<AlertNoLetOpenWindowComponent> ) { }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
