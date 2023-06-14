import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog-enviar-vuelto',
  templateUrl: './dialog-enviar-vuelto.component.html',
  styleUrls: ['./dialog-enviar-vuelto.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogEnviarVueltoComponent implements OnInit {
  public waitNotification = true;
  public onAdd = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<DialogEnviarVueltoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    setTimeout(()=> {
      this.waitNotification = false;
    }, 3000);
  }

  confirmarVuelto() : void {
    this.onAdd.emit("ok");
    this.dialogRef.close("ok");
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}
