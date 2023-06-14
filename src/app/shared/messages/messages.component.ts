import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  public contenido = '';
  public icono = null;
  public x = false;
  constructor(
    public snackBarRef: MatSnackBarRef<MessagesComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data) {
      this.contenido =  this.data?.contenido;
      this.icono =  this.data?.icono;
      this.x =  this.data?.x;
    }
  }
  cerrar(): void {
    this.snackBarRef.dismiss();
  }
}
