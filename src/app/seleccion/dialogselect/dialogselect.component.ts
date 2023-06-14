import { ChangeDetectorRef, Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { Card } from 'src/app/model/Card';
import { AuthService } from 'src/app/services/auth.service';
import { TransbankService } from 'src/app/services/transbank.service';
import { DebitoCreditoComponent } from 'src/app/shared/debito-credito/debito-credito.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { SMX_ERROR } from 'src/app/model/ErrorsTypes';
import { ErrordialogComponent } from 'src/app/shared/errordialog/errordialog.component';

@Component({
  selector: 'app-dialogselect',
  templateUrl: './dialogselect.component.html',
  styleUrls: ['./dialogselect.component.css']
})
export class DialogselectComponent implements OnInit,  OnChanges {

  list: Card[] | null | undefined;
  cardnumber?: string;
  selectedCard: Card[] | null | undefined;

  // 24-5
  // isInscriptionActive$ = this.transbankService.isInscriptionIngObservable;

  isInscribiendo = false;
  private showErrorDialogVisible = false;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private transbankService: TransbankService,
    private dialogRefe: MatDialogRef<DialogselectComponent>,
    private changeDetectorRefs: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
      this.agregarIconos();
    }
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }


  ngOnInit(): void {
    this.list = this.data.cards as Card[];
    this.cardnumber = this.data.cardnumber;
    // console.log(this.cardnumber);
    // this.checkInscriptionStatus();
    
    //this.transbankService.isInscriptionIngObservable.subscribe((result: boolean) => {
    //  this.actualizarTarjetasLocal();
    //});
  }

  actualizarTarjetasLocal(): void {
    if (this.authService.isLoggedIn) {
      // obtener tarjetas y esperar resultado.
      this.transbankService.tbkListCards(this.authService.currentUser?.rut + '', this.authService.getToken() + '')
        .subscribe(cards => {
          this.data.cards = cards;
          this.list = cards;
          this.changeDetectorRefs.detectChanges();
          if (!environment.production) {
            console.log('Se actualiza el lisado de tarjetas: actualizarTarjetasLocal()');
          }
        }, err => {
          console.log('Ocurrio un error en el servicio [transbankService.tbkListCards]: ', err);
        });
    } else {
      console.log('Error, se considera que el usuario siempe esta isLoggedIn en este punto.');
    }
  }

  cardExist(): boolean{
    if (this.list && this.list?.length > 0){
      return true;
    } else {
      return false;
    }
  }

  onCardsChange(item: Card | null | undefined | any): void {
    this.selectedCard = [item];
    this.dialogRefe.close(this.selectedCard?.[0]);
  }

  inscribirTarjeta(): void {
    this.isInscribiendo = true;
    const dialogRefDC = this.dialog.open(DebitoCreditoComponent, {
      panelClass: 'dialog-debito-credito',
      position: { bottom: '0px' },
      autoFocus: false
    });

    this.transbankService.isInscriptionIngObservable.subscribe((result: boolean) => {
      if (result) {
        this.isInscribiendo = false;
        this.dialogRefe.close('ACTUALIZAR-TARJETAS'); 
        // this.snackbarService.mostrarMensaje('Se inscribió una nueva tarjeta.');
      } else {
        // this.snackbarService.mostrarMensaje('No se pudo ingresar una nueva tarjeta.');
        this.showErrorDialog(11);
        this.dialogRefe.close('SIN-INSCRIPCION-TARJETA'); 
      }
      // this.dialogRefe.close('ACTUALIZAR-TARJETAS'); 
      // this.getData();
      // this.actualizarTarjetasLocal();
      // if (!environment.production) {console.log('nuevamente');}
      // this.dialogRefe.close();
    });



    dialogRefDC.afterClosed().subscribe((result: any) => {
      this.isInscribiendo = false;
    });

    return;
  }

  cerrarInscribirTarjeta(): void{
    this.dialogRefe.close(null);
    // this.dialogRef.close('ACTUALIZAR-TARJETAS');
  }

  cancelarInscribirTarjeta(): void {
    // tratar de cerrar ventana
    if (this.transbankService.openedInscriptionWindow){
      this.transbankService.openedInscriptionWindow.close();
    }
    // cancelar polling service
    this.transbankService.isInscripcionAlive = false;
    // cancelar polling propio
    // this.isAlive = false;
    this.isInscribiendo = false;

  }


/*   private checkInscriptionStatus(): void {

    const frecuenciaInscripcion = environment.tbkInscripcionFrecuencia;
    const timeOutInscripcion = environment.tbkInscripcionTimeOut;
    let isAlive = true;

    interval(frecuenciaInscripcion).pipe(
      timeout(timeOutInscripcion),
      takeWhile(() =>  isAlive),
      takeUntil(this.onDestroy$)
    ).subscribe(i => {

      if (this.transbankService.inscripcionSubscription && this.transbankService.inscripcionSubscription.closed) {
        if (!environment.production) {
          console.log('Finito inscripción');
        }
        isAlive = false;
        this.dialogRef.close('ACTUALIZAR-TARJETAS');
      }
    });
  } */

  showErrorDialog(index: number): void {
    if (this.showErrorDialogVisible) {
      return;
    }
    const smxerror = SMX_ERROR[index];
    if (!smxerror) {
      console.log('Error no tipificado [' + index + ']');
      return;
    }
    const dialogRef = this.dialog.open(ErrordialogComponent, {
      id: 'ErrordialogComponentInside',
      panelClass: 'error-dialog-wrapper',
      // width: '250px',
      data: { errorType: smxerror }
    });
    this.showErrorDialogVisible = true;
    dialogRef.afterClosed().subscribe((result: any) => {
      this.showErrorDialogVisible = false;
    });

  }

  agregarIconos(): void {
    this.matIconRegistry
          .addSvgIcon( 'mastercard', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/mastercard.svg'))
          .addSvgIcon( 'visa', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/visa.svg'))
          .addSvgIcon( 'redcompra', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/redcompra.svg'))
          .addSvgIcon( 'americanexpress', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/americanexpress.svg'))
          .addSvgIcon( 'magna', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/magna.svg'))
          .addSvgIcon( 'card-default', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/card-default.svg'));
  }
}

