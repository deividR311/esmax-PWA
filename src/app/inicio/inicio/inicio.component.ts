import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Estado } from 'src/app/model/Estado';
import { EessService } from 'src/app/services/eess.service';
import { OrdenService } from 'src/app/services/orden.service';
import { environment } from '@env/environment';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Eess } from 'src/app/model/Eess';
import { AuthService } from 'src/app/services/auth.service';
import { SMX_ERROR } from 'src/app/model/ErrorsTypes';
import { MatDialog } from '@angular/material/dialog';
import { DiscountUnregisteredComponent } from 'src/app/shared/discount-unregistered/discount-unregistered.component';
import Utils from 'src/app/shared/Utils';
import { ClientValidation } from 'src/app/model/clientValidation';
import { ClientValidationService } from 'src/app/services/client-validation.service';
import { Orden } from 'src/app/model/Orden';
import { MatStepper } from '@angular/material/stepper';
import { LoaderService } from 'src/app/shared/utilities/loader.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  animations: [
    trigger('Nike', [
      transition(':enter', [
        style({ transform: 'translateY(-20%)' }),
        // animate('0.4s 300ms ease-in', style({ transform: 'translateY(0%)' }))
        animate('0.4s', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        // animate('0.3s 300ms ease-in', style({ transform: 'translateY(-100%)' }))
        animate('0.3s', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ],
})
export class InicioComponent implements OnInit {

  version!: string;
  private idCart: any;
  status: any;
  statusEnum = Estado;
  // private eess: any;
  // producto: any = {};
  // monto: any = {};

  // ------> desde aquí 12/02
  eessData: Eess[] | undefined;
  eessName!: string;
  eessId!: string;
  eessHasProduct93 = false;
  eessHasProduct95 = false;
  eessHasProduct97 = false;
  eessHasProductD = false;
  showAlertError = false;
  showAlertErrorTitle = '';
  showAlertErrorMessage = '';
  qr: any;
  isready = false;
  orden: Orden;
  @ViewChild('stepper', { static: true }) stepper!: MatStepper;

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

  constructor(
    private ordenService: OrdenService,
    private eessService: EessService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private clientValidationService : ClientValidationService,
    private loaderService : LoaderService
  ) { }


  ngOnInit(): void {
    this.version = environment.version;

    // remove local storage ########################
    localStorage.removeItem('orden');
    localStorage.removeItem('TRXID');
    Utils.removePartialLocalStorage(`${environment.cartQR}`);
    // remove local storage ########################

    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.qr = paramMap.get('qr');
      if (!this.qr) {
        if (environment.qrModeOnly) {
          this.showAlertError = true;
          this.showAlertErrorMessage = SMX_ERROR[201]?.msg;
          this.showAlertErrorTitle = SMX_ERROR[201]?.title;
          this.ordenService.remove();
          this.authService.doLogout(true);
        } else {
          this.showAlertError = false;
          this.startupOutEess();
        }
      } else {
        this.showAlertError = false;
        this.startupIntoEess();
      }
    });
  }

  startupOutEess(): void {
    this.isready = true;
  }

  startupIntoEess(): void {
    this.showAlertErrorMessage = '';
    this.showAlertErrorTitle = '';
    this.showAlertError = false;
    this.eessService.getEessData(this.qr).subscribe(x => { // x: EessAndProducto[]

      if (x) {
        this.isready = true;
        if (this.ordenService.setInitialData(x, this.qr)) {
          if (environment.verbose) {
            console.log('startupIntoEess() setInitialData', x);
          }
        } else { // Error en ordenService.setInitialData
          this.showAlertError = true;
          this.showAlertErrorMessage = SMX_ERROR[202]?.msg;
          this.showAlertErrorTitle = SMX_ERROR[202]?.title;
        }
      } else {
        this.showAlertError = true;
        this.showAlertErrorMessage = SMX_ERROR[3]?.msg;
        this.showAlertErrorTitle = SMX_ERROR[3]?.title;
      }
      this.orden = this.ordenService.getOrden();
    }, err => {
      console.log('Error no es posible acceder al servicio. Sin acceso a datos.', err);
      this.showAlertError = true;
      this.showAlertErrorMessage = SMX_ERROR[2]?.msg;
      this.showAlertErrorTitle = SMX_ERROR[2]?.title;
    }

    );











    /*
        switch (this.status) {
          case Estado.INICIADO:
            if (this.qr != null) {
              // this.eess = this.eessService.getSurtidor(this.qr);
              console.log('------this.eess--------: ', this.eess);
              if (this.eess != null) {
                this.status = Estado.SELECCIONANDO;
              } else {
                console.log('No existe QR');
              }
            }
            break;
          case Estado.CARGANDO:
            console.log('Estado: CARGANDO');
            break;
          case Estado.PAGANDO:
            console.log('Estado: PAGANDO');
            break;
          case Estado.SELECCIONANDO:
            console.log('Estado: SELECCIONANDO');
            break;
          case Estado.TERMINADO:
            console.log('Estado: TERMINADO');
            break;
          default:
            console.error('No hay estado: ' + this.status);
            break;
        } */




  }

  getNombreFantasia(): string | null {
    if (!this.qr) {
      return 'Bienvenid@';
    } else {
      return this.ordenService.getOrden().eessName;
    }

  }


  seleccionandoOnSubmit(): void { }


  gotoLogin(): void {
    this.router.navigate(['/login']);
  }

  getOffers(rut : any, dialogRef : any = null) {
    this.loaderService.presentLoading();
    const currentUser = rut;
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
    this.offerRequestData.rutCliente = currentUser.slice(0, -1);
    this.clientValidationService.getOffers(this.offerRequestData).subscribe(
      (res : any) => {
        let notPromos = true;
        if (res.data?.content) {
          if (!((res.data.content.promosDisponibles || []).length === 0)) {
            notPromos = false;
            const { promosDisponibles, idBBR } = res.data.content;
            this.orden.offerList = promosDisponibles;
            this.orden.offerValidate = true;
            this.orden.idBBR = idBBR;
            this.orden.clientRut = rut;
            if (this.orden.offerList.length === 1) {
              this.orden.offerMyClub = this.orden.offerList[0].idAlianza === 442 || this.orden.offerList[0].descuentoUnitario === 0;
            }
            dialogRef.close();
            this.loaderService.closeLoading();
            this.ordenService.save(this.orden)
            this.router.navigate(['/seleccion']);
          }
        }
        if (notPromos) {
          if (dialogRef) {
            dialogRef.componentInstance.formLogin.controls['usuario'].setErrors({'incorrect': true});
            dialogRef.componentInstance.discounts = false;
            dialogRef.componentInstance.data.buttonsubmit = "Reintentar";
          }
          this.loaderService.closeLoading();
        }
      },
      (err) => {
        if (dialogRef) {
          dialogRef.componentInstance.formLogin.controls['usuario'].setErrors(null);
          dialogRef.componentInstance.data.description = "Estamos intentando reestablecer la conexión, por favor intentalo nuevamente en unos minutos.";
          dialogRef.componentInstance.data.buttonsubmit = "Reintentar";
        }
        this.loaderService.closeLoading();
        console.log(err);
      }
    )
  }

  gotoSeleccion(): void {
    const dialogRef = this.dialog.open(DiscountUnregisteredComponent, {
      height: '310px',
      width: '330px',
      disableClose: true,
      data: {
        imgSrc: '../../../assets/tick-circle.svg',
        title: 'Valida tu RUT',
        description: "Al ingresar tu RUT y validarlo, podrás ver si tienes activos descuentos en combustible para esta carga.",
        btnName: 'Aceptar',
        buttonsubmit : 'Verificar'
      }
    });

    const subOffers = dialogRef.componentInstance.onAdd.subscribe(result => {
      this.getOffers(result, dialogRef);
    });

    dialogRef.afterClosed().subscribe(result => {
      subOffers.unsubscribe();
      if (result) {
        if (result === "not") {
          this.router.navigate(['/seleccion']);
        }
      }
    });
  }

  gotoRegistro(): void {
    this.router.navigate(['/registro']);
  }

}
