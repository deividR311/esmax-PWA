import { OnDestroy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ProductoEnum } from 'src/app/model/ProductoEnum';
import { Orden } from 'src/app/model/Orden';
import { MedioPago } from 'src/app/model/MedioPago';
import { OrdenService } from 'src/app/services/orden.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { TransbankService } from 'src/app/services/transbank.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { DialogselectComponent } from '../dialogselect/dialogselect.component';
import { Card } from 'src/app/model/Card';
import Utils from 'src/app/shared/Utils';
import { interval, Subject, Subscription } from 'rxjs';
import { timeout, takeWhile, delay } from 'rxjs/operators';
import { FusionService } from 'src/app/services/fusion.service';
import { FusionState } from 'src/app/model/FusionState';
import { FusionStatusResponse } from 'src/app/model/FusionStatusResponse';
import { LoadingService } from 'src/app/services/loading.service';
import { DialogLoginBasicComponent } from 'src/app/login/dialog-login-basic/dialog-login-basic.component';
import { DialogEnviarBoletaCorreoComponent } from '../dialog-enviar-boleta-correo/dialog-enviar-boleta-correo.component';
import { ResponseSmxocmPagar } from 'src/app/model/ResponseSmxocmPagar';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogOtroMontoComponent } from '../dialog-otro-monto/dialog-otro-monto.component';
import { MenuPrincipalService } from '../../services/menu-principal.service';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { ResponseSmxwpyPagar } from 'src/app/model/ResponseSmxwpyPagar';
import { ResponseSmxchekPagar } from 'src/app/model/ResponseSmxchekPagar';
import { PdfService } from 'src/app/services/pdf.service';
import { EessService } from 'src/app/services/eess.service';
import { SMX_ERROR } from 'src/app/model/ErrorsTypes';
import { ErrordialogComponent } from 'src/app/shared/errordialog/errordialog.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GeneralState } from 'src/app/model/GeneralState';
import { GeneralStatusResponse } from 'src/app/model/GeneralStatusResponse';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { CashPayService } from 'src/app/services/cash-pay.service';
import { CashPayment } from 'src/app/model/cashPayment';
import { NotificationRecordService } from 'src/app/services/notification-record.service';
import { NotificationRecord } from 'src/app/model/notificationRecord';
import { NotificationInfo } from 'src/app/model/notificationInfo';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ClientValidationService } from 'src/app/services/client-validation.service';
import { ClientValidation } from 'src/app/model/clientValidation';
import { LoaderService } from 'src/app/shared/utilities/loader.service';
import { ClientValidationConfirm } from 'src/app/model/clientValidationConfirm';
import { EessModuleService } from 'src/app/services/eessModule.service';
import { DialogEnviarVueltoComponent } from '../dialog-enviar-vuelto/dialog-enviar-vuelto.component';
import { Estado } from 'src/app/model/Estado';
import { AlertNoLetOpenWindowComponent } from 'src/app/shared/alert-no-let-open-window/alert-no-let-open-window.component';

@Component({
  selector: 'app-seleccion',
  templateUrl: './seleccion.component.html',
  styleUrls: ['./seleccion.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SeleccionComponent implements OnInit, OnDestroy { // AfterContentInit

  constructor(private transbankService: TransbankService, private fusionService: FusionService,
    private changeDetectorRef: ChangeDetectorRef, private formBuilder: FormBuilder,
    private ordenService: OrdenService, private loadingService: LoadingService,
    public dialog: MatDialog, private authService: AuthService, private router: Router,
    private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
    private menuPrincipalService: MenuPrincipalService, private pdfService: PdfService,
    private eessService: EessService, private snackbarService: SnackbarService,
    private cashPayService : CashPayService,
    private notificationRecordService : NotificationRecordService,
    private db: AngularFireDatabase,
    private clientValidationService : ClientValidationService,
    private loaderService : LoaderService,
    private eessModuleService : EessModuleService
    ) {

    this.orden = ordenService.getOrden();
    this.showAlert = false;
    this.agregarIconos();
    this.menuPrincipalService.mostrarBotonAtras(false);
  }

  eventsSubjectPayment: Subject<void> = new Subject<void>();

  openedWindow: any;
  primerPaso!: FormGroup;
  segundoPaso!: FormGroup;
  tercerPaso!: FormGroup;
  cuartoPaso!: FormGroup;
  quintoPaso!: FormGroup;

  isCargaFinished = false;
  isPagoReady = false;
  isPagoFinished = false;
  isPagoFinishedWithErrors = false;
  iniciarLlamadaBackend = false;
  finished = false;

  isVisibleAtendedor = environment.isVisibleAtendedor;

  // ------> desde aquí 12/02
  productosDisponibles: Array<ProductoEnum> | null | undefined;
  showAlert = false;
  showAlertMensaje = '';
  orden: Orden;
  PRODUCTO = ProductoEnum;
  MEDIOPAGO = MedioPago;
  private propina = 0;
  private cardsFromUser: Card[] | null | undefined;
  private counterClickMedioPago = 0;
  private isPollingAlive = false;
  public statusSubscription!: Subscription;
  private FUSION_ESTATE: FusionState | undefined;
  private fusionStatusResponse: FusionStatusResponse | undefined;
  // 6/5/2021
  isDisabledClickToBoletaButton = true;
  // 14/5/2021
  isGoForTicket = false;
  isGoForStatusResult = false;
  // 06/8/2021
  isVentaEnCero = false;
  private showErrorDialogVisible = false;
  // 06/10/2021
  clickToBoletaEnable = true;
  // 04/11/2021
  private timeout1 = 0;
  private timeout2 = 0;
  private timeout1Subscription!: Subscription;
  private timeout2Subscription!: Subscription;
  @ViewChild('stepper', { static: true }) stepper!: MatStepper;

  // 27/5/2021
  public montoCargado = '';
  public litros = '';
  public vuelto = '';
  public codigovuelto = '';
  public resumenCompra?: Orden;
  public montosDisponibles = [3000, 5000, 10000, 15000, 20000, 30000, 40000, 60000];
  // public isproduction = true;
  private GENERAL_ESTATE: GeneralState | undefined;
  
  // NOTIFICATION_RECORD
  notificationRecord : NotificationRecord | undefined;
  notificationInfo : NotificationInfo | undefined;
  notificationRecordId : number ;
  cashNotificationId : number;
  cashNotificationPriority : number;
  // NOTIFICATION_RECORD

  // CASH_PAYMENT
  cashFrontendId : any;
  cashPayment : CashPayment = { data : null, order : null, frontendid : null };
  cashPaymentResponse : ApiResponse = { status : null, data: {}, message: '' };
  cashNotificationCountTime : number = 0;
  cashNotificationInterval : any;
  // CASH_PAYMENT

  // offers
  isOfferListSection : boolean = false;
  offerRequestData : ClientValidation = {
    codigoSolicitud: 1,
    fecha: null,
    hora: null,
    idEmpleado: 9999,
    local: null,
    pos: 9999,
    rutCliente: null,
    tipoDescuento: 'COMB-RUT'
   }
  offerlist : Array<any> = [];
  offerValidationConfirm : ClientValidationConfirm = {
    codProducto : null,
    fechaHora : null,
    idAlianza : null,
    idBBR : null,
    idDespacho : null,
    idPromocion : null,
    idTurno : 9999,
    litros : null,
    monto : null,
    precioDescuento : null,
    precioSinDescuento : null,
    rutCliente : null
  };
  idBBR : number = null;
  offerMyClub = false;
  //

  // ASSISTANCE
  assistanceNotificationId : number;
  assistanceNotificationPriority : number;
  assistanceNotificationCountTime : number = 0;
  assistanceNotificationInterval : any;
  // ASSISTANCE

  // PAYMENT METHOD
  paymentMethods : Array<any> = [];
  // PAYMENT METHOD

  reclamarVueltoNotification = true;
  completeNotificacionVuelto = false;
  dialogRefVuelto:any = null;
  confirmacionVuelto = false;
  reintentarChek = false;

  @ViewChild('SectionChek') matSectionChek;
  @ViewChild('SectionChekPasoReenviar') matSectionChekReenviar; 
  @ViewChild('SectionTelefonoChek') matSectionTelefonoChek;
  objetoWindowChek;

  ngOnInit(): void {    
    this.iniciarLlamadaBackend = false;
    // check initial conditions
    this.showAlert = false;
    this.showAlertMensaje = '';

    /*    
    if (environment.production) { // solo producción
      this.ordenService.check().subscribe(x => {
        if (!x) {
          this.showAlertMensaje = 'Por favor cierre la aplicación y vuelva a escanear el QR.';
          this.showAlert = true;
        }
      });
    } else {
     // this.isproduction = false;
    } */

    // this.orden = {} as Orden;
    this.primerPaso = this.formBuilder.group({ /* firstCtrl: ['', Validators.required] */ });
    this.primerPaso.setErrors({ error: true });
    this.segundoPaso = this.formBuilder.group({});
    this.segundoPaso.setErrors({ error: true });
    this.tercerPaso = this.formBuilder.group({});
    this.tercerPaso.setErrors({ error: true });
    // this.snackbarService.mostrarErrorType(9);
    this.checkAfterContentInit();
    if (this.ordenService.orden.offerList) {
      this.offerMyClub = this.ordenService.orden.offerMyClub;
      this.offerlist = this.ordenService.orden.offerList;
      this.idBBR = this.ordenService.orden.idBBR;
    } else {
      if (!this.ordenService.orden.offerValidate) {
        this.getOffers();
      }
    }
    this.getNotifications();
    this.getPaymentMethods();
  }

  // ngAfterContentInit(): void {
  checkAfterContentInit(): void {
    // this.stepper.selectedIndex = 4;
    // return;
    this.ordenService.checkIntoSeleccion().subscribe(x => {
      if (!x) {
        this.showAlertMensaje = 'Por favor cierre la aplicación y vuelva a escanear el QR.';
        this.showAlert = true;
      } else {
        this.ordenService.orden = this.ordenService.getOrden();
        this.orden = this.ordenService.orden;
        const stepperIdx = this.ordenService.orden.stepper;
        this.stepper.selectedIndex = this.ordenService.orden.stepper;
        const frontid = localStorage.getItem('FRONTENDID');
        // ** Status General ***************************************************************
        if (stepperIdx == 0) { /* producto   */ }
        if (stepperIdx == 1) { /* monto      */ }
        if (stepperIdx == 2) { /* medio pago */
          if (frontid) {
            this.getGeneralStatus(frontid);
          }
        }
        if (stepperIdx == 3    /* carga      */ ||
          stepperIdx == 4    /* listo      */) {

          if (environment.verbose) { console.log('getGeneralStatus para: ', frontid); }
          if (frontid) {
            this.getGeneralStatus(frontid);
          } else {
            if (environment.verbose) { console.log('Vacuidad de FRONTENDID'); }
            setTimeout(() => {
              this.causeTimeout(null);
            }, 0);
          }
        }
        if (environment.verbose) { console.log('paso # ', this.ordenService.orden.stepper); }
      }
    });

    setTimeout(() => {
      this.controlarBotonAtras();
    }, 0);
  }


  /* ++++++++++++++++++++++ Propina +++++++++++++++ */
  handleMinus(): void {
    if (this.ordenService.getOrden().propina === 0) { return; }
    this.ordenService.getOrden().propina = this.ordenService.getOrden().propina - 100;
  }
  handlePlus(): void {
    this.ordenService.getOrden().propina = this.ordenService.getOrden().propina + 100;
  }
  /* ++++++++++++++++++++++ Propina +++++++++++++++ */


  calculateLiters(): string {
    // price: number, monto: number
    const precio = this.ordenService.getOrden().productoSeleccionado?.price;
    const monto = this.ordenService.getOrden().monto;
    // this.orden.productoSeleccionado?.price

    let resultado = '--';
    if (precio && monto && precio !== 0) {
      resultado = (monto / precio).toFixed(2);
    }

    return resultado.toString().replace('.', ',');
  }

  /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
  /* +++++++++++++++++++++++ Clicks ++++++++++++++++++++++++++++ */
  /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
  clickProducto(productoEnum: ProductoEnum): void {
    this.primerPaso.setErrors(null);
    this.ordenService.orden.productoSeleccionado = this.ordenService.productoFromProductEnum(productoEnum);
    const deviceId = this.ordenService.orden.fpdeviceid;
    const eessId = this.ordenService.orden.eessId;
    
    if (this.offerlist.length > 0) {
      this.isOfferListSection = true;
    }
    this.stepper.selectedIndex = 1;
    this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);

    this.orden = this.ordenService.getOrden();
    // reservar (deviceid,ideess) ----------------------------------------------
    if (environment.enableTimeOut) {
      this.eessService.reservar(deviceId, eessId)
        .subscribe(aresponse => {
          if (aresponse.status === 'success') {
            try {
              this.timeout1 = aresponse.data?.timeout1;
              this.timeout2 = aresponse.data?.timeout2;
              if (environment.verbose) { console.log('[Timeout-1]: ', this.timeout1 + ' ms'); console.log('[Timeout-2]: ', this.timeout2 + ' ms'); }
              if (environment.verbose) { console.log('Comienzo [Timeout-1]'); }
              this.timeout1Subscription = interval(this.timeout1)
                // .pipe(
                // timeout(this.timeout1),
                // takeWhile(() => this.isPollingAlive),)
                .subscribe(() => {
                  this.causeTimeout(100);
                });

            } catch (error) {
              console.error('No se pudo asignar el timeout indicado', error);
              this.causeTimeout(101);
            }

          } else {
            // no se puede reservar --> no se puede continuar.
            this.causeTimeout(101);
          }
        }, err => {
          console.log('Ocurrio un error en el servicio de reserva: ', err);
        });
    }
  }

  // offers
  getOffers() {
    const currentUser = Utils.currentUserFromStorage();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const hour = today.getHours();
    const minute = today.getMinutes() + 1;
    const second = today.getSeconds();
    this.offerRequestData.fecha = `${year}${month}${day}`;
    this.offerRequestData.hora = `${hour}${minute}${second}`;
    this.offerRequestData.local = `CH${this.orden.eessId}`;
    this.offerRequestData.rutCliente = currentUser?.rut.slice(0, -1);
    this.loaderService.presentLoading();
    this.clientValidationService.getOffers(this.offerRequestData).subscribe(
      (res : any) => {
        if (res.data?.content) {
          const { promosDisponibles, idBBR } = res.data.content;
          promosDisponibles.forEach((offer : any) => offer.selected = false);
          this.offerlist = promosDisponibles;
          this.idBBR = idBBR;
          if (this.offerlist.length === 1) {
            this.offerMyClub = this.offerlist[0].idAlianza === 442 || this.offerlist[0].descuentoUnitario === 0;
          }
        }
        this.loaderService.closeLoading();
      },
      (err) => {
        this.loaderService.closeLoading();
        console.log(err);
      }
    )
  }

  chooseOffer( offer : any ) {    
    this.offerlist.forEach((offer) => offer.selected = false);
    offer.selected = true;
    
    this.ordenService.orden.discount = offer.descuentoUnitario;
    this.ordenService.orden.maxAmount = offer.montoDiarioDisponible;
    this.ordenService.orden.discountAlliance = offer.nombreAlianza;
    this.ordenService.orden.offer = offer;
    this.ordenService.orden.discountName = offer.nombrePromocion;
  }

  deSelect() {
    this.offerlist.forEach((offer) => offer.selected = false);
  }

  applyOfferToOrder( offer : boolean = false ) {
    if (offer) {
      this.showOfferDialog(false, 'Tu descuento ha sido aplicado exitosamente sobre el producto seleccionado.');
    } else {
      this.isOfferListSection = false;
      this.ordenService.orden.discount = null;
      this.ordenService.orden.maxAmount = null;
      this.ordenService.orden.discountAlliance = null;
      this.ordenService.orden.offer = null;
      this.orden = this.ordenService.getOrden();
      this.stepper.selectedIndex = 1;
      this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
      this.deSelect();
    }
  }

  removeOffer() {
    this.ordenService.orden.discount = null;
    this.ordenService.orden.maxAmount = null;
    this.ordenService.orden.discountAlliance = null;
    this.deSelect();
  }

  showOfferDialog( isError : boolean = false, message : string = "" ) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        imgSrc: '../../../assets/tick-circle.svg',
        title: 'Descuento aplicado',
        description: message,
        btnName: 'Aceptar',
        isError
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isOfferListSection = false;
      this.orden = this.ordenService.getOrden();
      this.stepper.selectedIndex = 1;
      this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
    });
  }

  offerConfirm() {
    const currentUser = Utils.currentUserFromStorage();
    
    const { productoSeleccionado, fusionStatusResponse, discount, offer } = this.ordenService.getOrden();
    const today = new Date();
    const year = today.getFullYear();
    const month = ((today.getMonth() + 1) < 10) ? `0${today.getMonth() + 1}` : today.getMonth();
    const day = ((today.getDate() + 1) < 10) ? `0${today.getDate() + 1}` : today.getDate();
    const hour = ((today.getHours() + 1) < 10) ? `0${today.getHours() + 1}` : today.getHours();
    const minute = ((today.getMinutes() + 1) < 10) ? `0${today.getMinutes() + 1}` : today.getMinutes();
    const second = ((today.getSeconds() + 1) < 10) ? `0${today.getSeconds() + 1}` : today.getSeconds();

    this.offerValidationConfirm.codProducto = productoSeleccionado.productno;
    this.offerValidationConfirm.fechaHora = Number(`${year}${month}${day}${hour}${minute}${second}`);
    this.offerValidationConfirm.idAlianza = offer.idAlianza;
    this.offerValidationConfirm.idBBR = this.idBBR;
    this.offerValidationConfirm.idDespacho = Number(fusionStatusResponse.trxid);
    this.offerValidationConfirm.idPromocion = offer.idPromocion;
    this.offerValidationConfirm.litros = Number(fusionStatusResponse.cantidadproducto.split(' ')[0]);
    this.offerValidationConfirm.monto = fusionStatusResponse.montodispensado;
    this.offerValidationConfirm.precioDescuento = productoSeleccionado.price - discount;
    this.offerValidationConfirm.precioSinDescuento = productoSeleccionado.price;
    this.offerValidationConfirm.rutCliente = (currentUser) ? currentUser.rut : this.ordenService.orden.clientRut;
    
    this.loaderService.presentLoading();    
    this.clientValidationService.offerConfirm(this.offerValidationConfirm).subscribe(
      (res : any) => {
        this.loaderService.closeLoading();
      },
      (err) => {
        this.loaderService.closeLoading();
        console.log(err);
      }
    )
  }
  // offers

  clickMonto(monto: number): void {
    this.segundoPaso.setErrors(null);
    // this.stepper.selectedIndex = 2;
    this.ordenService.orden.monto = monto;
    this.stepper.next();
    this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
    this.orden = this.ordenService.getOrden();
  }

  clickMdePago( paymentMethodId : any): void {
    this.tercerPaso.setErrors(null);
    let mdp = this.selectPaymentMethod( Number(paymentMethodId) );
    this.ordenService.getOrden().mediopago = mdp;

    if (mdp === MedioPago.WEBPAY) {
      this.isPagoReady = true; // alert('... Próximamente ... '); return;
      this.intoZoneProtected(); // this.stepper.next();
      this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
      this.orden = this.ordenService.getOrden();
    }

    if (mdp === MedioPago.ONECLICK) {
      // isloggedIn ?
      if (!this.authService.isLoggedIn) {
        const dialogRef = this.dialog.open(DialogLoginBasicComponent, {
          id: 'DialogLoginBasicComponent',
          panelClass: 'dialog-login-basic',
          position: { bottom: '0px' },
          data: {
            medioPago: MedioPago.ONECLICK
          }
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          // cuando el usuario presiona en el dialog, el enlace de registrarse
          if (result === 'registro') {
            this.router.navigate(['/registro']);
            return;
          }
          // cerrado es para cuando el usuario presiona en la 'x' del modal
          if (result === 'cerrado') {
            return;
          }

          if (this.authService.isLoggedIn) {
            // obtener tarjetas y esperar resultado.
            this.transbankService.tbkListCards(this.authService.currentUser?.rut + '', this.authService.getToken() + '')
              .subscribe(cards => {
                this.cardsFromUser = cards;
                this.ordenService.getOrden().card = Utils.getFavCard(cards);
                if (this.cardsFromUser.length > 0) {
                  // hay tarjetas se puede continuar ....
                  this.isPagoReady = true;
                  this.intoZoneProtected(); // this.stepper.next();
                  this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
                  this.orden = this.ordenService.getOrden();
                } else {
                  this.noHayTarjeta();
                }
              }, err => {
                console.log('Ocurrio un error en el servicio [transbankService.tbkListCards]: ', err);
              });
          }
        });
      } else { // isLoggedIn = true

        // obtener tarjetas y esperar resultado.
        this.transbankService.tbkListCards(this.authService.currentUser?.rut + '', this.authService.getToken() + '')
          .subscribe(cards => {
            if (!cards) {
              console.log('Error en servicio que lista tarjetas - no es posible continuar.');
              return;
            }
            this.cardsFromUser = cards;
            this.ordenService.getOrden().card = Utils.getFavCard(cards);
            if (this.cardsFromUser.length > 0) {
              // hay tarjetas se puede continuar ....
              this.isPagoReady = true;
              // ? this.intoZoneProtected();
              this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
              this.orden = this.ordenService.getOrden();
            } else {
              this.noHayTarjeta();
            }
          }, err => {
            console.log('Ocurrio un error en el servicio [transbankService.tbkListCards]: ', err);
          });

      }
    }

    if (mdp === MedioPago.CASH) {
      this.isPagoReady = true;
      this.intoZoneProtected();
      this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
      this.orden = this.ordenService.getOrden();
    }


    if(mdp === MedioPago.CHEK){
      this.pedirTelefonoChek(true);
      this.isPagoReady = false;
      this.clickPagar();
      this.iniciarLlamadaBackend = true;
    }
  }

  selectPaymentMethod( paymentMethodId : number = null ) {    
    let mdp : MedioPago = null;
    if (paymentMethodId) {
      switch (paymentMethodId) {
        case 1:
        mdp = this.MEDIOPAGO.ONECLICK;
        break;
  
        case 2:
        mdp = this.MEDIOPAGO.WEBPAY;
        break;
  
        case 3:
        mdp = this.MEDIOPAGO.CASH;
        break;
  
        case 4:
        mdp = this.MEDIOPAGO.CHEK;
        break;
      
        default:
        mdp = null;
        break;
      }
    }

    return mdp;
  }

  clickPagar(): void {
    this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
    this.orden = this.ordenService.getOrden();
    if (environment.verbose) { console.log('orden', this.ordenService.getOrden()); }
    if (environment.enableTimeOut) {
      this.timeout1Subscription?.unsubscribe(); // se interrumpe timeout-1
      if (environment.verbose) { console.log(' Interrupción [Timeout-1]    Comienzo [Timeout-2]'); }
      this.timeout2Subscription = interval(this.timeout2) // se inicia timeout-2
        .subscribe(() => {
          this.causeTimeout(100);
        });
    }
    this.isPagoFinishedWithErrors = false;
    const frontendid = Utils.gerenateUUID();
    localStorage.setItem('FRONTENDID', frontendid);
    this.iniciarLlamadaBackend = true;

    if (this.ordenService.getOrden().mediopago === MedioPago.ONECLICK) { // ****** MedioPago.ONECLICK *****************
      this.transbankService.tbkPagarOneClick(this.ordenService.getOrden(), frontendid, this.orden.discount).subscribe(
        result => {
          this.iniciarLlamadaBackend = false;
          this.postPago(result, frontendid);
        }, err => {
          console.log('Error en el canal de pago [OneClick]: ', err);
          this.iniciarLlamadaBackend = false;
        });
    }

    if (this.ordenService.getOrden().mediopago === MedioPago.WEBPAY) { // ****** MedioPago.WEBPAY **********************
      const objetowindow = window.open('/esperando', 'smxWebPay', '_blank');
      if (!objetowindow) {
        alert('Su navegador impide que se abra una nueva ventana. Debe permitir las ventanas emergentes en la configuración.');
        return;
      }

      this.transbankService.tbkWebPay(this.ordenService.getOrden(), frontendid, objetowindow,  this.orden.discount)
        .subscribe((result: boolean) => {
          if (result) { // ya hay polling en ejecución.
            this.transbankService.isWebPayIngObservable.subscribe(
              (result: boolean) => {
                if (environment.verbose) { console.log('result{WebPay} ->', result); }
                this.iniciarLlamadaBackend = false;
                let resultado: ApiResponse = { status: 'no-se-pudo-pagar-MedioPago-WEBPAY', data: null, message: 'no-se-pudo-pagar-MedioPago-WEBPAY' };
                if (result) {
                  resultado = { status: 'success', data: null, message: null };
                }
                this.postPago(resultado, frontendid);
              });
          } else {
            console.log('No terminó correctamente el proceso transbankService.tbkWebPay');
            this.showErrorDialog(12);
          }

        }
        );
    }

    if (this.ordenService.getOrden().mediopago === MedioPago.CHEK) { 
      this.eventsSubjectPayment.next();
      this.menuPrincipalService.mostrarBotonAtras(false);
      this.transbankService.tbkPagarChek(this.ordenService.getOrden(), frontendid, this.authService.currentUser?.telefono || "", this.orden.discount).subscribe(
        result => {
          this.clickOpenChek(result.data.redirect_url);
          localStorage.setItem('FRONTENDID', frontendid);
          setTimeout(()=> {
            this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
            this.postPago(result, frontendid);
            this.reintentarChek = true;
          }, 500);
        }, err => {
          console.log('Error en el canal de pago [Chek]: ', err);
          this.menuPrincipalService.mostrarBotonAtras(true);
          this.reintentarChek = false;
          this.iniciarLlamadaBackend = false;
          this.matSectionChek._element.nativeElement.style.display = "none";
          this.matSectionTelefonoChek._element.nativeElement.style.display = "none";
          this.matIconRegistry.addSvgIcon('chek', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/chek.svg'));
          this.matSectionChekReenviar._element.nativeElement.style.display = "block";
        });
    }



    if (this.ordenService.getOrden().mediopago === MedioPago.CASH) {
      this.cashFrontendId = frontendid;
      this.cashPaymentCreate();
    }
  }

  getLitersAsNumber() {
    const { monto, productoSeleccionado, discount } = this.ordenService.getOrden();
    const precio = (discount) ? productoSeleccionado?.price - discount : productoSeleccionado?.price;
    let liters = monto / precio;
    return Number(liters.toFixed(2));
  }

  // CASH PAYMENT - NOTIFICATION RECORD
  cashPaymentCreate() {
    const { monto, productoSeleccionado, discount, discountName } = this.ordenService.getOrden();
    const currentUser = Utils.currentUserFromStorage();
    
    const today = new Date();

    const data = {
      cashPaymentId: null,
      amount: monto,
      timestamp: today,
      state: 'PENDING',
      updateTimestamp: null,
      iddsps: (productoSeleccionado) ? productoSeleccionado.iddsps : null,
      rut: null,
      idpaymenttrx: null,
      userRut: (currentUser) ? currentUser.rut : null,
      productName: (productoSeleccionado) ? productoSeleccionado.frontend_productname : null,
      pricePerLiter: (productoSeleccionado) ? productoSeleccionado.price : null,
      liter: this.getLitersAsNumber(),
      discountTotal: (discount) ? discount : null,
      discount: (discount) ? discount : null,
      total: this.sumTotal(),
      literPriceWithDiscount : (discount) ? productoSeleccionado.price - discount : null,
      discountName : (discount) ? discountName : null
    };
    
    this.cashPayment.data = data;
    this.cashPayment.order = this.ordenService.getOrden();
    this.cashPayment.frontendid = this.cashFrontendId;
    
    this.cashPayService.create(this.cashPayment).subscribe(
      (res : any) => {
        this.cashPayment.data.idpaymenttrx = res.data.idpaymenttrx;
        this.cashPayment.data.cashPaymentId= res.data.cashPaymentId;
        this.notificationRecordCreate(res, productoSeleccionado, currentUser, today);
        this.catchFirebaseTransactionState( productoSeleccionado?.ideess, res.data.cashPaymentId );
      },
      (err) => {
        this.showCashDialog( true );
      }
    )
  }

  catchFirebaseTransactionState( ideess : any, cashPaymentId : any ) {
    this.db.object(`cashPayment-${ideess}/${cashPaymentId}`).valueChanges().subscribe(
      (res : any) => {
        const { state, updateTimestamp } = res;
        
        this.runNotificationCountTime( 'cash', state, updateTimestamp );
        if (state === 'REJECTED') {
          this.showCashDialog( true, 'Transacción no completada' );
          this.iniciarLlamadaBackend = false;
        }
        
        if (state === 'COMPLETED') {
          this.iniciarLlamadaBackend = false;
          this.cashPaymentResponse.status = 'success';
          this.postPago( this.cashPaymentResponse, this.cashFrontendId );
        }
        
        if (state === 'PENDING' && updateTimestamp) {
          this.showCashDialogVuelto( true, 'Transacción no atendida' );
          this.iniciarLlamadaBackend = false;
        }
      },
      (err) => { this.showCashDialog( true, 'Error interno' ); }
    )
  }

  notificationRecordCreate(res : any, productoSeleccionado : any, currentUser : any, today : any) {
    const { cashPaymentId, iddsps, userRut, amount } = res.data;
    let data = {
      notificationRecordId : null,
      timestamp: today,
      notificationId: this.cashNotificationId,
      iddsps: iddsps,
      rut: null,
      idpaymenttrx: null,
      state: 'PENDING',
      updateTimestamp: null,
      userRut: userRut,
      payment_description: 'EFECTIVO',
      cashPaymentId: cashPaymentId,
      peopleRut: userRut
    };

    let info = {
      monto: amount,
      nombres: (currentUser) ? `${currentUser.nombres} ${currentUser.apellidos}` : null,
      state: 'PENDING',
      surtidor: (productoSeleccionado) ? productoSeleccionado?.dspdeviceid : null,
      timestamp: `${Math.floor(today.getTime() / 1000)}`,
      updateTimestamp: "",
      ideess: (productoSeleccionado) ? productoSeleccionado?.ideess : null,
      isView: false,
      notificationId : this.cashNotificationId,
      priority : this.cashNotificationPriority
    }

    this.notificationRecord = data;
    this.notificationInfo = info;
    this.notificationRecordService.create(this.notificationRecord, this.notificationInfo).subscribe(
      (res : any) => {
        this.showCashDialog( null, 'Un atendedor se acercará a recibir tu pago');
      },
      (err : any) => {
        this.showCashDialog( true, 'Error interno' );
      }
    )
  }

  showCashDialog( isError : boolean = false, message : string = "" ) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        imgSrc: '../../../assets/moneys.svg',
        title: 'Pago en efectivo',
        description: message,
        btnName: 'Aceptar',
        isError
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (isError) {
        this.iniciarLlamadaBackend = false;
      }
    });
  }

  showCashDialogVuelto( isError : boolean = false, message : string = "" ) {
    if (this.dialogRefVuelto) return;
    this.dialogRefVuelto = this.dialog.open(DialogComponent, {
      data: {
        imgSrc: '../../../assets/card-tick.svg',
        title: 'Solicitud de vuelto',
        description: message,
        btnName: 'Aceptar',
        isError
      }
    });

    this.dialogRefVuelto.afterClosed().subscribe(result => {
      this.dialogRefVuelto = null;
      if (isError) {
        this.iniciarLlamadaBackend = false;
      }
    });
  }

  getNotifications() {
    this.notificationRecordService.getNotifications().subscribe(
      (res : any) => {
        const { data } = res;
        this.cashNotificationsData( data );
        this.assistanceNotificationsData( data );
      },
      (err) => {
        console.log(err);
      }
    )
  }

  cashNotificationsData( data : any ) {
    if (data) {
      const cashNotification = data.find((notification : any) => notification.title.includes('efectivo'));
      this.cashNotificationId = Number(cashNotification.notificationId);
      this.cashNotificationPriority = cashNotification.priority;
    } else {
      this.cashNotificationId = null;
      this.cashNotificationPriority = null;
    }
  }
  // CASH PAYMENT - NOTIFICATION RECORD

  // ASSISTANCE
  assistanceNotificationsData( data : any ) {
    if (data) {
      const assistanceNotification = data.find((notification : any) => notification.title.includes('Asistencia'));
      this.assistanceNotificationId = Number(assistanceNotification.notificationId);
      this.assistanceNotificationPriority = assistanceNotification.priority;
    } else {
      this.assistanceNotificationId = null;
      this.assistanceNotificationPriority = null;
    }
  }

  assistanceNotification() {
    const { productoSeleccionado } = this.ordenService.getOrden();
    const currentUser = Utils.currentUserFromStorage();
    
    const today = new Date();

    let data = {
      notificationRecordId : null,
      timestamp: today,
      notificationId: this.assistanceNotificationId,
      iddsps: (productoSeleccionado) ? productoSeleccionado.iddsps : null,
      rut: null,
      idpaymenttrx: null,
      state: 'PENDING',
      updateTimestamp: null,
      userRut: (currentUser) ? currentUser.rut : null,
      payment_description: null,
      cashPaymentId: null,
      peopleRut: (currentUser) ? currentUser.rut : null
    };

    let info = {
      monto: null,
      nombres: (currentUser) ? `${currentUser.nombres} ${currentUser.apellidos}` : null,
      state: 'PENDING',
      surtidor: (productoSeleccionado) ? productoSeleccionado?.dspdeviceid : null,
      timestamp: `${Math.floor(today.getTime() / 1000)}`,
      updateTimestamp: "",
      ideess: (productoSeleccionado) ? productoSeleccionado?.ideess : null,
      isView: false,
      notificationId : this.assistanceNotificationId,
      priority : this.assistanceNotificationPriority
    }

    this.notificationRecord = data;
    this.notificationInfo = info;
    this.notificationRecordService.create(this.notificationRecord, this.notificationInfo).subscribe(
      (res : any) => {
        const { data } = res;
        this.loaderService.presentLoading(true);
        this.catchFirebaseAssistanceState(productoSeleccionado?.ideess, data.notificationRecordId);
      },
      (err : any) => {
        this.showAssistanceDialog( true, 'Error interno' );
      }
    )
  }

  catchFirebaseAssistanceState( ideess : any, notificationRecordId : any ) {
    this.db.object(`notification-${ideess}/${notificationRecordId}`).valueChanges().subscribe(
      (res : any) => {
        const { state, updateTimestamp } = res;
        
        this.runNotificationCountTime( 'Assistance', state, updateTimestamp );
        if (state === 'PENDING' && updateTimestamp) {
          this.loaderService.closeLoading();
        //  this.showCashDialogVuelto( true, 'Transacción no atendida' );
          this.showAssistanceDialog( true, 'Asistencia no atendida' );
        }
        if (state === 'COMPLETED') {
          this.loaderService.closeLoading();
          this.showAssistanceDialog( false, 'Un atendedor se acercará a ayudarte' );
        }
      },
      (err) => { this.showAssistanceDialog( true, 'Error interno' ); }
    )
  }

  runNotificationCountTime( notificationType : string = '', notificationState : string = '', updateTimestamp : any ) {
    if (notificationType === 'Assistance' && notificationState === 'PENDING' && !updateTimestamp) {
      this.assistanceNotificationInterval = setInterval(() => {
        this.assistanceNotificationCountTime++;

        if (this.assistanceNotificationCountTime == 120) {
          this.assistanceNotificationCountTime = 0;
          clearInterval(this.assistanceNotificationInterval);
          this.loaderService.closeLoading();
          this.showAssistanceDialog( true, 'Asistencia no atendida' );
        }
      }, 1000);
    } else if (notificationType === 'Assistance') {
      clearInterval(this.assistanceNotificationInterval);
      this.assistanceNotificationCountTime = 0;
    }
    if (notificationType === 'cash' && notificationState === 'PENDING' && !updateTimestamp) {
      this.cashNotificationInterval = setInterval(() => {
        this.cashNotificationCountTime++;

        if (this.cashNotificationCountTime == 120) {
          this.cashNotificationCountTime = 0;
          clearInterval(this.cashNotificationInterval);
          this.loaderService.closeLoading();
          this.showCashDialog( true, 'Transacción no atendida' );
        }
      }, 1000);
    } else if (notificationType === 'cash') {
      clearInterval(this.cashNotificationInterval);
      this.cashNotificationCountTime = 0;
    }
  }

  showAssistanceDialog( isError : boolean = false, message : string = "" ) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        imgSrc: '../../../assets/tick-circle.svg',
        title: 'Asistencia',
        description: message,
        btnName: 'Aceptar',
        isError
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
  // ASSISTANCE

  // PAYMENT METHOD
  getPaymentMethods() {
    const { eessId } = this.ordenService.getOrden();
    this.eessModuleService.getPaymentMethodsByEess( eessId ).subscribe(
      (res : any) => {
        const { data } = res;
        if (data) {
          this.paymentMethods = data;
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }
  // PAYMENT METHOD

  postPago(result: ApiResponse | null, frontendid: string): void {
    this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
    this.orden = this.ordenService.getOrden();
    if (environment.enableTimeOut) {
      this.timeout2Subscription.unsubscribe(); // se interrumpe timeout-2
    }
    if (result?.status === 'success') {
      if (this.ordenService.getOrden().mediopago === MedioPago.CHEK) {
        this.isPagoReady = true;
        this.intoZoneProtected();
        if (this.FUSION_ESTATE) {
          if (['INICIADA', 'PAGANDO'].indexOf((this.FUSION_ESTATE).toString()) === -1) {
            this.reintentarChek = false;
            this.isPagoFinished = true;
            this.menuPrincipalService.mostrarBotonAtras(false);
            this.menuPrincipalService.mostrarBotonHamburguesa(false);
            console.log('-- Pago ok --');
          }
        }
      }
      else {
        this.isPagoFinished = true;
        this.menuPrincipalService.mostrarBotonAtras(false);
        this.menuPrincipalService.mostrarBotonHamburguesa(false);
        console.log('-- Pago ok --');
      }

      try {
        if (this.ordenService.getOrden().mediopago === MedioPago.ONECLICK) {
          this.ordenService.getOrden().pagoResponseOcm = result.data as ResponseSmxocmPagar;
        }
        if (this.ordenService.getOrden().mediopago === MedioPago.WEBPAY) {
          this.ordenService.getOrden().pagoResponseWpy = result.data as ResponseSmxwpyPagar;
        }
        if (this.ordenService.getOrden().mediopago === MedioPago.CHEK) {
          this.ordenService.getOrden().pagoResponseChek = result.data as ResponseSmxchekPagar;
        }
        if (this.ordenService.getOrden().mediopago === MedioPago.CASH) {
          this.ordenService.getOrden().pagoResponseCash = result.data as CashPayment;
        }
      } catch (error) {
        console.log('No fue posible almacenar el resultado del pago');
      }
      
      this.pagoExitoso(frontendid);

    } else { // pago con error -------------------------------
      this.isPagoFinishedWithErrors = true;
      console.log('Pago con error. Causa: ', result?.message);
      if (this.ordenService.getOrden().mediopago === MedioPago.WEBPAY) {
        this.showErrorDialog(24);
      } else {
        this.showErrorDialog(9);
      }
    }
  }

  // start polling
  pagoExitoso(id: string): void {
    this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
    this.orden = this.ordenService.getOrden();
    if (id) { // const id = localStorage.getItem('FRONTENDID');
      this.pollingFusionStatus();
    } else {
      console.error('No existe FRONTENDID');
    }
  }


  private intoZoneProtected(): void {
    this.stepper.selectedIndex = 2;
  }


  /*** tarjetas ---------------------   */
  actualizarTarjetas(): void {
    if (this.authService.isLoggedIn) {
      // obtener tarjetas y esperar resultado.
      this.transbankService.tbkListCards(this.authService.currentUser?.rut + '', this.authService.getToken() + '')
        .subscribe(cards => {
          this.cardsFromUser = cards;
          this.ordenService.getOrden().card = Utils.getFavCard(cards);
          this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
          this.orden = this.ordenService.getOrden();
          if (!environment.production) {
            console.log('Se actualiza el lisado de tarjetas...');
          }
        }, err => {
          console.log('Ocurrio un error en el servicio [transbankService.tbkListCards]: ', err);
        });
    } else {
      console.log('Error, se considera que el usuario siempe esta isLoggedIn en este punto.');
    }
  }
  noHayTarjeta(): void {
    const dialogselectComponentNht = this.dialog.open(DialogselectComponent, {
      panelClass: 'dialog-select-card',
      id: 'DialogselectComponent',
      // width: '250px',
      data: { cards: this.cardsFromUser }
    });

    dialogselectComponentNht.afterClosed().subscribe((result: any) => {
      if (!environment.production) {
        console.log('Resultado de cierre dialogo noHayTarjeta', result);
      }

      if (result) {
        if (result === 'ACTUALIZAR-TARJETAS') {
          this.obtenerTarjetasAndForget();
        }
        if (result === 'SIN-INSCRIPCION-TARJETA') {
          //this.obtenerTarjetasAndForget();
        }

      }

    });

  }
  clickCambiarTarjeta(): void {
    if (this.authService.isLoggedIn) {
      // obtener tarjetas y esperar resultado.
      this.transbankService.tbkListCards(this.authService.currentUser?.rut + '', this.authService.getToken() + '')
        .subscribe(cards => {
          this.cardsFromUser = cards;
          this.ordenService.getOrden().card = Utils.getFavCard(cards);
          if (!environment.production) {
            console.log('Se actualiza el lisado de tarjetas...');
          }
          // se abre ventana dialog -------------------------------------
          let once = true;
          const dialogselectComponentCt = this.dialog.open(DialogselectComponent, {
            id: 'DialogselectComponent',
            panelClass: 'dialog-select-card',
            // width: '250px',
            data: { cards: this.cardsFromUser, cardnumber: this.ordenService.getOrden().card?.cardnumber }
          });



          dialogselectComponentCt.afterClosed().subscribe((result: any) => {

            if (!environment.production) {
              console.log('Resultado de cierre dialogo clickCambiarTarjeta', result);
            }

            if (result) {
              if (result === 'ACTUALIZAR-TARJETAS') {
                this.obtenerTarjetasAndForget();
                if (once) {
                  this.clickCambiarTarjeta();
                  once = false;
                }
              } else {
                try {
                  const cardSelected = result as Card;
                  this.ordenService.getOrden().card = cardSelected;
                  this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
                  this.orden = this.ordenService.getOrden();
                } catch (error) {
                  console.log('Card cast error');
                }

              }
            }

          });
          // dialog -----------------------------------------------------

        }, err => {
          console.log('Ocurrio un error en el servicio [transbankService.tbkListCards]: ', err);
        });
    } else {
      console.log('Error, se considera que el usuario siempe esta isLoggedIn en este punto.');
    }
    // dialogRef.close('Pizza!');
  }
  /*** tarjetas ---------------------   */

  clickMuestraIndicaciones(): void {
    this.stepper.next();
  }
  clickToBoleta(): void {
    this.stepper.next();
  }
  clickEnd(): void {
    this.router.navigate(['/evaluaExperiencia']);
  }

  /**
   * Obtener tarjetas one click
   * @returns tarjetas
   */
  obtenerTarjetasAndForget(): any {
    if (!environment.production) {
      console.log('Se actualiza tarjetas ');
    }
    this.transbankService.tbkListCards(this.authService.currentUser?.rut + '', this.authService.getToken() + '').subscribe(cards => {
      this.cardsFromUser = cards;
      this.ordenService.getOrden().card = Utils.getFavCard(cards);
      if (this.cardsFromUser.length > 0) {
        return true;
      }
      return false;
    }, err => {
      console.log('Ocurrio un error en el servicio [transbankService.tbkListCards]: ', err);
      return false;
    });
  }


  verBoletaGoogleViewer(): void {
    let path = this.fusionStatusResponse?.rutapdf + '';
    if (!environment.production && this.ordenService.getOrden().mediopago !== MedioPago.CASH) { // url dummy de pdf
      path = 'http://asp4qa.paperless.cl/Facturacion/PDFServlet?docId=HDXIm2b0AP5EcCnQCs6AHemvsN2fLkYE';
    }
    if (path === '') {
      alert('No hay boleta disponible aún, vuelva a consultar más tarde.');
      return;
    }

    if (Utils.myBrowser() === 'Chrome') {
      const encodedPath = window.btoa(encodeURIComponent(path));
      this.openedWindow = window.open('/boleta/' + encodedPath, /* 'boleta',*/ '_blank');
    } else {
      this.openedWindow = window.open(path, /* 'boleta',*/ '_blank');
    }

    if (!this.openedWindow) {
      alert('No es posible abrir una nueva ventana con la boleta.');
    }

  }


  sumTotal(): number {
    return this.ordenService.getOrden().monto + this.ordenService.getOrden().propina;
  }


  showProductosDisponibles(producto: ProductoEnum): boolean {
    return this.ordenService.hasProduct(producto);
  }



  /**
   * Status de una orden
   * Polling internal service
   * frontendid
   */
  private pollingFusionStatus(): void {

    const frontendid = localStorage.getItem('FRONTENDID');

    const frecuenciaCarga = environment.cargaFrecuencia;
    const timeOutCarga = environment.cargaTImeOut;
    this.isPollingAlive = true;

    this.statusSubscription = interval(frecuenciaCarga).pipe(
      timeout(timeOutCarga),
      takeWhile(() => this.isPollingAlive),
      // takeUntil(this.onDestroy$)
    ).subscribe(() => {
      /* if (!environment.production) {
      console.log(`Servicio consulta de status para: ${frontendid}`);
    } */
      this.getFusionStatus(frontendid + '');
    });
  }
  private getFusionStatus(frontendid: string): void {
    const result = this.fusionService.statusByFrontendId(frontendid)
      .pipe(delay(0))
      .subscribe((res: any) => {
        if (environment.verbosePollingEvent) {
          console.log(`Status [${frontendid}] `, res);
        }
        this.FUSION_ESTATE = res as FusionState;
        if ((this.orden.mediopago || "").toUpperCase() === 'CASH') {
          if ((this.FUSION_ESTATE).toString() === 'DISPENSING') {
            if (!this.finished) {
              this.finished = true;
              setTimeout(() => {
                let objetSend = {...this.cashPayment.data};
                objetSend['order'] = this.cashPayment.order;
                this.cashPayService.finish(objetSend).subscribe(
                  (res : any) => {
                    this.FUSION_ESTATE = FusionState.OK;
                  },
                  (err) => {
                    console.log(err);
                    this.finished = false;
                  }
                )
             }, 5000);
            }
          }
          if ((this.FUSION_ESTATE).toString() === 'TRXPAYABLE') {
            this.FUSION_ESTATE = FusionState.OK;
            this.eventNavigation(this.FUSION_ESTATE);
            this.finished = false;
            return;      
          }
        }
        if ((this.orden.mediopago || "").toUpperCase() === 'CHEK') {
          if (this.FUSION_ESTATE) {
            if (['INICIADA', 'PAGANDO'].indexOf((this.FUSION_ESTATE).toString()) === -1) {
              this.reintentarChek = false;
              this.eventNavigation(this.FUSION_ESTATE);
            }
          }
        }
        else {
          if (this.FUSION_ESTATE) {
            this.eventNavigation(this.FUSION_ESTATE);
          }
        }
      },
        (error: any) => {
          // this.errors = error;
          this.showAlertMensaje = 'Ha ocurrido un problema con el servicio. Por favor, contacte a un antendedor.';
          this.showAlert = true;
        },
      );
  }

  private eventNavigation(fusionState: FusionState): void {

    switch (fusionState) {

      /*
       ----> authorized <----
      case FusionState.PAGADO: {
        this.stepper.selectedIndex = 2;
        this.isPagoFinished = true;
        break;
      } */

      case FusionState.WAITNOZZLE:
      case FusionState.DISPENSING: {
        this.stepper.selectedIndex = 3;
        this.isCargaFinished = false;
        break;
      }

      case FusionState.STARTPLATINO: // TEMP . TODO
      case FusionState.DISPENSED: {
        this.stepper.selectedIndex = 3;
        this.isCargaFinished = true;
        break;
      }

      // case FusionState.TRXCLEARED:
      /* case FusionState.ENDPLATINO:
      case FusionState.ENDBILLING: {

        this.isDisabledClickToBoletaButton = false;

        // add 14-5-2021 buscar boleta
        if (!this.isGoForTicket) {
          this.fusionService.getFusionStatusResult().subscribe((resultstatus: any) => {
            this.fusionStatusResponse = resultstatus;
            this.isGoForTicket = true;
            this.preparedDataToShow(); // 8-9-2021
          });
        }
        break;
      } */

      case FusionState.OK: {
        // supone el paso penúltimo ---- -2
        // this.isCargaFinished = true;
        // supone el paso último    ---- -1
        // this.isDisabledClickToBoletaButton = false;

        // 20/8 se busca siempre el ultimo getFusionStatusResult pero solo una vez
        if (!this.isGoForStatusResult) {
          this.isGoForStatusResult = true;
          this.fusionService.getFusionStatusResult().subscribe((resultstatus: any) => {
            this.fusionStatusResponse = resultstatus;
            if (environment.verbose) { console.log('[FusionState.OK]: ', this.fusionStatusResponse); }
            this.isCargaFinished = true;                // supone el paso penúltimo ---- -2
            this.isDisabledClickToBoletaButton = false; // supone el paso último    ---- -1

            this.preparedDataToShow();
            // Reset & Logout ------------------!!!!!!!!!!!!!!!!!!!!!!!!!!
            localStorage.setItem('TRXID', this.ordenService.getOrden().fusionStatusResponse?.trxid + ''); // para encuesta 24-11
            // 1-12-2021 this.authService.doLogout(true);
            // 1-12-2021 this.ordenService.remove();
            this.ordenService.getOrden().card = null;
            // Reset & Logout ------------------!!!!!!!!!!!!!!!!!!!!!!!!!!
          });
        }

        this.isPollingAlive = false;
        this.loadingService.forceInterrupt();

        break;
      }

      case FusionState.ERRAUTHORISE: {
        if (this.MEDIOPAGO.CHEK) {
          this.isPagoFinished = true;
        }
        break;
      }

      case FusionState.TIMEOUT: {
        this.isPollingAlive = false;
        this.loadingService.forceInterrupt();

        setTimeout(() => {
          this.causeTimeout(102);
        }, 0);
        break;
      }

      case FusionState.NOK: {
        this.isPollingAlive = false;
        this.loadingService.forceInterrupt();

        setTimeout(() => {
          this.showAlertMensaje = 'Ha ocurrido un problema con el servicio. Por favor, contacte a un antendedor.';
          console.error(this.showAlertMensaje);
          this.showAlert = true;
          this.changeDetectorRef.detectChanges();
        }, 0);
        break;
      }

      case FusionState.AUTHORISE : {
        if (this.MEDIOPAGO.CHEK) {
          if (this.objetoWindowChek) {
            this.objetoWindowChek.close();
            this.objetoWindowChek = null;
            this.reintentarChek = false;
          }
          this.stepper.selectedIndex = 3;
          this.isCargaFinished = false;
          break;
        }
        break;
      }

      case FusionState.PAGADO: {
        if (this.MEDIOPAGO.CHEK) {
          if (this.objetoWindowChek) {
            this.objetoWindowChek.close();
            this.objetoWindowChek = null;
            this.reintentarChek = false;
          }
        }
        break;
      }

    }
  }


  preparedDataToShow(): void {
    this.ordenService.saveOrdenToLocalStorage(this.stepper.selectedIndex);
    this.orden = this.ordenService.getOrden();
    // Si se llega hasta acá fusionStatusResponse no puede ser null
    if (!this.fusionStatusResponse) {
      if (!environment.production) {
        console.error('fusionStatusResponse no puede ser null');
      }
    }
    this.resumenCompra = { ...this.ordenService.getOrden() };
    
    if (this.ordenService.getOrden().fusionStatusResponse?.montodispensado === null || 
        this.ordenService.getOrden().fusionStatusResponse?.montodispensado === 0) {
      this.isVentaEnCero = true;
    } else {
      this.isVentaEnCero = false;
    }

    let smallchange = this.ordenService.getOrden().fusionStatusResponse?.vuelto;
    if (smallchange == null) {
      smallchange = '0';
    }


    let filledAmount = this.ordenService.getOrden().fusionStatusResponse?.montodispensado; // .montototal; // 6-9
    if (filledAmount == null || isNaN(+filledAmount)) {
      filledAmount = 0;
    }

    let litres = this.ordenService.getOrden().fusionStatusResponse?.cantidadproducto?.replace('LTR', '');
    // if (litres  || litres === undefined) {
    if (litres === undefined) {
      litres = '0';
    } else {
      const left = litres.split(".")[0];
      const rigth = litres.split(".")[1];
      if (rigth) {
        litres = left + ',' + rigth.substring(0, 2);
      } else {
        litres = left + ',' + '00';
      }
    }

    if (this.isVentaEnCero) {
      smallchange = this.ordenService.getOrden().monto + '';
    }

    this.montoCargado = '' + filledAmount;
    this.litros = '' + litres;
    this.vuelto = '' + smallchange;
    this.codigovuelto = '' + this.ordenService.getOrden().fusionStatusResponse?.codigovuelto;

    if (this.ordenService.getOrden().fusionStatusResponse?.codigovuelto) {
      this.notificacionVuelto();
     // this.notificacionVuelto();
    // this.clickReclamarVuelto();
    }

    // oculta lo relacionado con la boleta si no está.
    if (!this.fusionStatusResponse?.rutapdf) {
      this.clickToBoletaEnable = false;
    }

    if (this.fusionStatusResponse.cantidadproducto) {
      if (this.orden.discount || this.orden.discount === 0) {
        this.offerConfirm();
      }
    }

   
  }

  
   notificacionVuelto() {
    const currentUser = Utils.currentUserFromStorage();

    // Consume service alerta vuelto
    let dataNotification = {
      notificationRecordId: null,
      timestamp: new Date(),
      notificationId: 3,
      iddsps: (this.ordenService.getOrden()) ? this.ordenService.getOrden().productoSeleccionado.iddsps : null,
      rut: null,
      idpaymenttrx: this.cashPayment.data.idpaymenttrx,
      updateTimestamp: null,
      userRut: (currentUser) ? currentUser.rut : null,
      cashPaymentId: this.cashPayment.data.cashPaymentId,
      peopleRut: (currentUser) ? currentUser.rut : null,
      state: 'PENDING',
      payment_description: 'VUELTO'
    };

    let infoNotification = {
      monto: Number(this.vuelto),
      nombres: (currentUser) ? `${currentUser.nombres} ${currentUser.apellidos}` : 'Cliente Desconocido',
      state: 'PENDING',
      surtidor: this.ordenService.getOrden().fpdeviceid,
      timestamp: `${Math.floor(new Date().getTime() / 1000)}`,
      updateTimestamp: "",
      ideess: this.ordenService.getOrden().eessId,
      isView: false,
      notificationId: 3,
      priority: 2
    };

    this.notificationRecord = dataNotification;
    this.notificationInfo = infoNotification;

    this.notificationRecordService.create(this.notificationRecord, this.notificationInfo).subscribe(
      (res: any) => {
        const { data } = res;
        let intentos = 0;
        let ideess = this.ordenService.getOrden().productoSeleccionado.ideess;
        let notificationRecordId = data.notificationRecordId;

        this.notificationRecordId = data.notificationRecordId;

        this.db.object(`notification-${ideess}/${notificationRecordId}`).valueChanges().subscribe(
          (response: any) => {
            const { state, updateTimestamp } = response;
            if (state === 'PENDING' && updateTimestamp) {
             // this.showCashDialog(true, 'Notificación de vuelto no atendida');
              this.showCashDialogVuelto( true, 'Transacción no atendida' );
              this.completeNotificacionVuelto = true;
              this.reclamarVueltoNotification = true;
            }
            if (state === 'COMPLETED') {
             
              this.completeNotificacionVuelto = true;
              this.clickReclamarVuelto();
             // this.completeNotificacionVuelto = false;
            }
          },
          (err) => {

            this.showAssistanceDialog(true, 'Error al enviar la notificación de vuelto');
            console.log(err);
          }
        );

      },
      (err: any) => {
        this.showCashDialog(true, 'Error interno');
      }
    );
  }

  /* ----------------- Navegación Hitorial---------------------------------*/
  componentSeleccionBackAction(): boolean {
    // console.log('this.localStepper.selectedIndex', this.stepper.selectedIndex);
    if (this.stepper.selectedIndex === 0) {
      return true;
    } else {
      //  index[2]: pago ---- !isPagoReady
      //                      isPagoReady && !isPagoFinished
      //                      isPagoFinished
      if (this.stepper.selectedIndex === 2 && this.isPagoReady && !this.isPagoFinished) {
        this.isPagoReady = false;
      } else if (this.stepper.selectedIndex === 1 && !this.isOfferListSection && this.offerlist.length > 0) {
        this.isOfferListSection = true;
      } else if (this.stepper.selectedIndex === 1 && this.isOfferListSection) {
        this.stepper.previous();
      } else {
        this.stepper.previous();
      }
      return false;
    }
  }
  abrirModalEnviarBoletaCorreo(): void {
    if (this.fusionStatusResponse) {
      const fusionStatusResponse = this.fusionStatusResponse;
      this.dialog.open(DialogEnviarBoletaCorreoComponent, {
        id: 'DialogEnviarBoletaCorreoComponent',
        panelClass: 'dialog-enviar-boleta-correo',
        position: { bottom: '0px' },
        autoFocus: false,
        // disableClose:true,
        data: { fusionStatusResponse }
      });
    }
  }
  agregarIconos(): void {
    this.matIconRegistry
      .addSvgIcon('pago-digital', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/pago-digital.svg'))
      .addSvgIcon('atendedor-blanco', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/atendedor-blanco.svg'))
      .addSvgIcon('efectivo', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/efectivo.svg'))
      // tslint:disable-next-line:max-line-length
      .addSvgIcon('tarjetas-debito-credito', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/tarjetas-debito-credito.svg'))
      .addSvgIcon('tarjetas-medio-de-pago', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/tarjetas-medio-de-pago.svg'))
      .addSvgIcon('chek', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/chek.svg'))
      .addSvgIcon('wallet-search', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/wallet-search.svg'))
      .addSvgIcon('mastercard', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/mastercard.svg'))
      .addSvgIcon('visa', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/visa.svg'))
      .addSvgIcon('redcompra', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/redcompra.svg'))
      .addSvgIcon('americanexpress', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/americanexpress.svg'))
      .addSvgIcon('magna', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/magna.svg'))
      .addSvgIcon('card-default', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/card-default.svg'))
      .addSvgIcon('enviar', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/enviar.svg'))
      .addSvgIcon('info-help', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/infoHelp.svg'))
      .addSvgIcon('card-tick', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/card-tick.svg'))
      .addSvgIcon('card-slash', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/card-slash.svg'))
      .addSvgIcon('money', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/moneys.svg'))
      .addSvgIcon('profile', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/profile-circle.svg'))
      .addSvgIcon('money-disabled', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/moneysDisabled.svg'))
      .addSvgIcon('chek-disabled', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/ChekDisabled.svg'));
  }
  abrirModalOtroMonto(): void {
    this.dialog.open(DialogOtroMontoComponent, {
      id: 'DialogOtroMontoComponent',
      panelClass: 'dialog-otro-monto',
      position: { bottom: '0px' },
      autoFocus: false,
    });
  }

  controlarBotonAtras(): void {
    const stepsSinBotonAtras = [0, 3, 4]; // seleccion tipo combustible, carga, listo

    if (stepsSinBotonAtras.includes(this.stepper.selectedIndex)) {
      this.menuPrincipalService.mostrarBotonAtras(false);
    } else {
      if (!this.menuPrincipalService.mostrandoBotonAtras) {
        this.menuPrincipalService.mostrarBotonAtras(true);
      }
    }

    this.stepper.selectionChange.subscribe((data: any) => {
      const { selectedIndex } = data;

      // oculto el boton atras
      if (stepsSinBotonAtras.includes(selectedIndex)) {
        this.menuPrincipalService.mostrarBotonAtras(false);
      } else {
        if (!this.menuPrincipalService.mostrandoBotonAtras) {
          this.menuPrincipalService.mostrarBotonAtras(true);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.menuPrincipalService.mostrarBotonAtras(true);
    this.menuPrincipalService.mostrarBotonHamburguesa(true);
    // GP ? 21/08
    // this.resumenCompra = { ...this.ordenService.getOrden() };
    if (this.statusSubscription) { this.statusSubscription.unsubscribe(); }
    if (this.timeout1Subscription) { this.timeout1Subscription.unsubscribe(); }
    if (this.timeout2Subscription) { this.timeout2Subscription.unsubscribe(); }
  }

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
      id: 'ErrordialogComponent',
      panelClass: 'error-dialog-wrapper',
      // width: '250px',
      data: { errorType: smxerror }
    });
    this.showErrorDialogVisible = true;
    dialogRef.afterClosed().subscribe((result: any) => {
      this.showErrorDialogVisible = false;
    });

  }

  causeTimeout(errorCode: number | null): void {
    if (errorCode) { this.showErrorDialog(errorCode); }
    this.authService.doLogout(false);
    this.ordenService.remove();
    // subscription -----------------------
    this.timeout1Subscription?.unsubscribe();
    this.timeout2Subscription?.unsubscribe();
    this.statusSubscription?.unsubscribe();

    try {
      if (this.transbankService.inscripcionSubscription) {
        this.transbankService.isInscripcionAlive = false;
        this.transbankService.inscripcionSubscription.unsubscribe();
      }
      if (this.transbankService.webPaySubscription) {
        this.transbankService.isWebPayAlive = false;
        this.transbankService.webPaySubscription.unsubscribe();
      }

    } catch (error) {
      console.log('Error cancelando Subscription ', error)
    }

    this.transbankService.webPaySubscription?.unsubscribe();
    // dialog ----------------------------- 
    // this.dialogselectComponent?.close(); TODO
    // id: 'DialogLoginBasicComponent',
    // id: 'DialogselectComponent',
    // id: 'DialogEnviarBoletaCorreoComponent',
    // id: 'DialogOtroMontoComponent',
    // id: 'ErrordialogComponent',

    const dialogExist = this.dialog.getDialogById('DialogselectComponent');
    if (dialogExist) {
      dialogExist.close();
    }

  }


  private getGeneralStatus(frontendid: string): void {
    const result = this.fusionService.generalStatus(frontendid)
      .pipe(delay(0))
      .subscribe((res: GeneralStatusResponse) => {
        this.GENERAL_ESTATE = res.statusgeneral as GeneralState;
        if (environment.verbose) { console.log(`Status General: `, this.GENERAL_ESTATE); }
        switch (this.GENERAL_ESTATE) {

          case GeneralState.PAGADO:
          case GeneralState.DISPENSANDO:
          case GeneralState.FINALIZADO: {
            this.pollingFusionStatus();
            this.stepper.selectedIndex = 3;
            this.ordenService.saveOrdenToLocalStorage(3);
            this.orden = this.ordenService.getOrden();
            this.menuPrincipalService.mostrarBotonAtras(false);
            this.menuPrincipalService.mostrarBotonHamburguesa(false);
            console.log('-- Pago ok (from refresh)--');
            break;
          }
          // case GeneralState.FINALIZADO: {
          //  this.causeTimeout(null);
          //  break;
          // }
          case GeneralState.PAGANDO: {
            /*
            this.isPagoReady = true; 
            "stepper?.selectedIndex == 2 && (isPagoReady && !isPagoFinished)"
            this.isPagoFinishedWithErrors = false;
            this.iniciarLlamadaBackend = true;

            this.transbankService.pollingWebPayFromRefresh();
            */
            const tbktoken = localStorage.getItem('TBK_TOKEN');
            if (!tbktoken) {
              setTimeout(() => {
                this.causeTimeout(103);
              }, 0);
              console.log('No están completos los datos necesarios.');
            } else {
              this.transbankService.pollingWebPayFromRefresh(tbktoken);
              this.isPagoFinishedWithErrors = false;
              this.isPagoReady = true;
              this.iniciarLlamadaBackend = true;
              this.transbankService.isWebPayIngObservable.subscribe((result: boolean) => {
                if (!result) {
                  console.log('No terminó correctamente el proceso transbankService.tbkWebPay');
                  this.showErrorDialog(30);
                } else {

                  if (environment.verbose) { console.log('result{WebPay} from refresh ->', result); }
                  this.iniciarLlamadaBackend = false;
                  let resultado: ApiResponse = { status: 'no-pago-WEBPAY-FROM-REFRESH', data: null, message: 'no-pago-WEBPAY-FROM-REFRESH' };
                  if (result) {
                    resultado = { status: 'success', data: null, message: null };
                  }
                  this.postPago(resultado, frontendid);

                }
              }
              );


            }
            break;
            // hacer polling y mostrar algo en el medio...

          }
          case GeneralState.RECHAZADO: {
            setTimeout(() => {
              this.causeTimeout(103);
            }, 0);
            break;
          }

        }
      },
        (error: any) => {
          // this.errors = error;
          this.showAlertMensaje = 'Ha ocurrido un problema con el servicio. Por favor, contacte a un antendedor.';
          this.showAlert = true;
        },
      );
  }

  pedirTelefonoChek(s) {
    if (s) {
      this.matSectionChek._element.nativeElement.style.display = "none";
      this.matSectionTelefonoChek._element.nativeElement.style.display = "block";
    }
    else {
      this.matSectionTelefonoChek._element.nativeElement.style.display = "none";
      this.matSectionChek._element.nativeElement.style.display = "block";
    }
  }

  intentarPagoChek() {
    this.matSectionChekReenviar._element.nativeElement.style.display = "none";
    this.pedirTelefonoChek(true);
    this.clickMdePago(this.MEDIOPAGO.CHEK);
  }

  cancelarChek() {
    this.matSectionChekReenviar._element.nativeElement.style.display = "none";
    this.matSectionChek._element.nativeElement.style.display = "block";
  }

  clickOpenChek(url) {
    this.objetoWindowChek = window.open(url, '_blank');
    if (!this.objetoWindowChek) {
      this.alertToNoOpenWindow();
      return;
    }
  }

  alertToNoOpenWindow(): void {
    this.dialog.open(AlertNoLetOpenWindowComponent, {
      disableClose: true
    });
  }

  private fnCloseWindowChek() {
    if (this.isPagoFinished === false) {
      this.isPollingAlive = false;
      this.loadingService.forceInterrupt();
      this.orden.mediopago = null;
      this.orden.mediopagoid = null;
      this.orden.estado = Estado.INICIADO;
      this.orden.fusionStatusResponse = null;
      this.timeout1Subscription?.unsubscribe();
      this.timeout2Subscription?.unsubscribe();
      this.statusSubscription?.unsubscribe();
      this.isPagoReady = false;
      this.isPagoFinished = false;
      this.iniciarLlamadaBackend = false;
      this.stepper.selectedIndex = 2;
      this.menuPrincipalService.mostrarBotonAtras(true);
      this.changeDetectorRef.detectChanges();
    }
  }

  clickReclamarVueltoNotify(){
    this.reclamarVueltoNotification = false;
    this.notificacionVuelto();
  }

  clickReclamarVuelto() {
    this.reclamarVueltoNotification = false;
  
    const dialogRef = this.dialog.open(DialogEnviarVueltoComponent, {
      id: 'DialogEnviarVueltoComponent',
      panelClass: 'dialog-enviar-vuelto',
      disableClose: true,
      height: 'auto',
      width: '300px',
      data: { 
        imgSrc: '../../../assets/card-tick.svg',
      }
    });

    const subscribeVuelto = dialogRef.componentInstance.onAdd.subscribe(result => {
      this.reclamarVueltoNotification = true;
    });

    dialogRef.afterClosed().subscribe(result => {
      subscribeVuelto.unsubscribe();
      if (result) {
        if (result !== "not") {
          //this.clickEnd();
        }
      }
      this.reclamarVueltoNotification = true;
    });
    
    dialogRef.afterClosed().subscribe(result => {
      
      subscribeVuelto.unsubscribe();
      if (result) {
        if (result !== "not") {
          //this.clickEnd();

         // createConfirmation
         this.reclamarVueltoNotification = false;
         this.completeNotificacionVuelto = false;
          console.log( this.notificationRecord);
          console.log( this.notificationInfo);
          this.notificationInfo.state = "COMPLETED"

          this.notificationRecordService.createConfirmation(this.notificationInfo, this.notificationRecordId).subscribe(
            (res : any) => {
              console.log(res);
              this.confirmacionVuelto = true;
            });

        }
      }
     
    });
  }

  cancelPaymentChek() {
    if (this.isPagoFinished === false && this.orden.mediopago === this.MEDIOPAGO.CHEK) {
      this.loaderService.presentLoading();
      this.reintentarChek = false;
      if (this.objetoWindowChek){
        this.objetoWindowChek.close();
        this.objetoWindowChek = null;
      }
      this.fnCloseWindowChek();
      this.loaderService.closeLoading();
    }
  }
}

