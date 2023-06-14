import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA, MatDialogClose} from '@angular/material/dialog';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.css']
})
export class PoliticasComponent implements OnInit {

  constructor( public dialog: MatDialog ) { }

  ngOnInit(): void {

  }

  openDialog(): void{
    this.dialog.open( PoliticasComponent, {
        autoFocus: false,
        maxHeight: '90vh' // you can adjust the value as per your view
    });
  }

}
