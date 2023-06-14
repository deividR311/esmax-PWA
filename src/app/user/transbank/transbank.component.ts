import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Card } from 'src/app/model/Card';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TransbankService } from 'src/app/services/transbank.service';
import { DebitoCreditoComponent } from 'src/app/shared/debito-credito/debito-credito.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MENSAJES } from '../../model/Mensajes';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
@Component({
  selector: 'app-transbank',
  templateUrl: './transbank.component.html',
  styleUrls: ['./transbank.component.css']
})
export class TransbankComponent implements OnInit {

  list: Card[] | null | undefined;
  selectedCard: Card[] | null | undefined;
  favCard: Card | null | undefined;
  isDataLoaded = false;

  constructor(private authService: AuthService, private transbankService: TransbankService,
    public dialog: MatDialog, private snackbarService: SnackbarService,
    private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getData();
    this.agregarIconos();
  }


  cardExist(): boolean {
    if (this.list && this.list?.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  setFav(index: number): void {
    let i = 0;
    if (!this.list) {
      return;
    }
    for (const { } of this.list) {
      if (index === i) {
        this.list[i].status = 'OKDEFAULT';
        this.transbankService.tbkSetFavCard(this.list[i], this.authService.currentUser?.rut + '').subscribe(result => {
          if (result) {
            console.log('Tarjeta es favorita.');
          }
        });
      } else {
        this.list[i].status = 'OK';
      }
      i++;
    }
  }

  setDel(index: number): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      panelClass: 'dialog-confirm',
      position: { bottom: '0px' },
      autoFocus: false,
      data: {
        pregunta: '¿Estás seguro de eliminar <br>una tarjeta registrada?',
        textoBotonAceptar: 'Eliminar'
      }
    });
    dialogRef.afterClosed().subscribe((respuesta: boolean) => {
      // es true si presiona eliminar, falso cancelar
      if (respuesta) {
        if (this.list) {
          const tarjeta = this.list[index];
          this.transbankService.tbkDeleteCard(tarjeta).subscribe(result => {
            if (result) {
              if (this.list) { this.list.splice(index, 1); }
              console.log('Tarjeta eliminada correctamente.');
            } else {
              console.log('Tarjeta NO se pudo eliminar.');
            }
          }, err => {
            console.log('Ocurrio un error en el servicio [transbankService.tbkDeleteCard]: ', err);
          });
        }
        /* if (this.list) {delete this.list[index]; } */
      }
    });
  }

  getData(): void {
    if (this.authService.isLoggedIn) {
      // obtener tarjetas y esperar resultado.
      this.transbankService.tbkListCards(this.authService.currentUser?.rut + '', this.authService.getToken() + '')
        .subscribe(cards => {
          this.list = cards;
          // this.favCard = Utils.getFavCard(cards);
          this.isDataLoaded = true;
          if (this.list.length > 0) {
            // hay tarjetas se puede continuar ....
          } else {
            //
          }
        }, err => {
          console.log('Ocurrio un error en el servicio [transbankService.tbkListCards]: ', err);
        });
    }
  }


  inscribirTarjeta(): void {

    const dialogRef = this.dialog.open(DebitoCreditoComponent, {
      panelClass: 'dialog-debito-credito',
      position: { bottom: '0px' },
      autoFocus: false
    });
 
    dialogRef.afterClosed().subscribe((respuesta: string) => {
      this.transbankService.isInscriptionIngObservable.subscribe((result: boolean) => {
        if (result) {
          this.snackbarService.mostrarMessageType(MENSAJES.SE_INSCRIBIO_NUEVA_TARJETA);
        } else {
          // this.snackbarService.mostrarMensaje('No se pudo ingresar una nueva tarjeta.');
          // this.snackbarService.mostrarErrorType(11);
          this.snackbarService.mostrarMessageType(MENSAJES.SE_RECHAZO_INSCRIPCION_TARJETA );
        }
        this.getData();
      });

      // una vez que se cierra DebitoCreditoComponent se espera 15 segundos y se cancella el polling si no hay ventana
      /* 
    setTimeout(() => {
      console.log('check');
      this.transbankService.inscripcionSubscription?.unsubscribe();
    }, 3000);
    */

    });



  }


  agregarIconos(): void {
    this.matIconRegistry
      .addSvgIcon('mastercard', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/mastercard.svg'))
      .addSvgIcon('visa', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/visa.svg'))
      .addSvgIcon('redcompra', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/redcompra.svg'))
      .addSvgIcon('americanexpress', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/americanexpress.svg'))
      .addSvgIcon('magna', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/magna.svg'))
      .addSvgIcon('card-default', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/card-default.svg'));
  }
}
