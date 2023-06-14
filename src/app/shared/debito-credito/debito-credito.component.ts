import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { TransbankService } from 'src/app/services/transbank.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';


@Component({
  selector: 'app-debito-credito',
  templateUrl: './debito-credito.component.html',
  styleUrls: ['./debito-credito.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DebitoCreditoComponent implements OnInit {

  public opcionSeleccionada = '';


  constructor(public dialogRef: MatDialogRef<DebitoCreditoComponent>,
              private authService: AuthService, private transbankService: TransbankService,
              private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.agregarIconos();
  }

  ngOnInit(): void { }

  cerrar(respuesta: string = ''): void {
    // const opts = 'menubar=no,location=yes,resizable=yes,scrollbars=no,status=no';
    if (respuesta === '') {
      this.dialogRef.close(respuesta);
      return;
    }
    const objetowindow = window.open('/esperando', '_blank');
    // const objetowindow = window.open('https://www.esmax.cl/', 'tbk', opts);
    // objetowindow?.blur();
    // window.focus();

    if (!objetowindow) { // A reference to the newly created window, or null if the call failed
      alert('Su navegador impide que se abra una ventana emergente. Debe permitir las ventanas emergentes en la configuración.');
      return;
    }

    if (respuesta === 'CREDITO') {
      /* if (confirm('Va a ser redirigido al sitio web de Transbank.')) { */
      this.transbankService.tbkInscripcionApi(this.authService.currentUser?.rut + '',
        this.authService.currentUser?.email + '', 'CREDITO', objetowindow);
      /* } */
    }
    if (respuesta === 'DEBITO') {
      /* if (confirm('Va a ser redirigido al sitio web de Transbank.')) { */
      this.transbankService.tbkInscripcionApi(this.authService.currentUser?.rut + '',
        this.authService.currentUser?.email + '', 'DEBITO', objetowindow);
      /* } */
    }

    this.opcionSeleccionada = respuesta;
    this.dialogRef.close(respuesta);

/*     objetowindow.close = () => {
      console.log('--------------->Child window closed');
      // this.dialogRef.close(respuesta);
    }; */
    /*     objetowindow.onunload = () => {
          console.log('Child window closed');
          this.dialogRef.close(respuesta);
        }; */




    // this.dialogRef.close(respuesta);
  }

  agregarIconos(): void {
    this.matIconRegistry
      .addSvgIcon('card-debito', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/card-debito.svg'))
      .addSvgIcon('card-credito', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/card-credito.svg'));
  }
}
