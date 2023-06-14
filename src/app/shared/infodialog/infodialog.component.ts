import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-infodialog',
  templateUrl: './infodialog.component.html',
  styleUrls: ['./infodialog.component.css']
})
export class InfodialogComponent implements OnInit {

  mensaje = 'Ha ocurrido un error con el pago.';

  constructor() { }

  ngOnInit(): void {
  }

}
