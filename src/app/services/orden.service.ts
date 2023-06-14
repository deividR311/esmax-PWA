import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Estado } from '../model/Estado';
import { Orden } from '../model/Orden';
import { ProductoEnum } from '../model/ProductoEnum';
import { EessService } from './eess.service';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EessAndProducto } from '../model/EessAndProducto';
import Utils from '../shared/Utils';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor(private eessService: EessService) { }

  orden: Orden = {
    id: '-1',
    qr: '',
    estado: Estado.INICIADO,
    eessAndProductos: [],
    monto: 0,
    mediopago: null,
    mediopagoid: null,
    propina: 0,
    productosDisponibles: [],
    productoSeleccionado: null,
    eessId: null,
    eessName: null,
    fpdeviceid: null,
    card: null,
    pagoResponseOcm: null,
    pagoResponseWpy: null,
    pagoResponseChek: null,
    pagoResponseCash: null,
    fusionStatusResponse: null,
    cardType: 'DEBITO', // default value
    stepper: 0,
    discount: null,
    maxAmount: null,
    offerList: null,
    offerValidate: null,
    discountAlliance : null,
    offer : null,
    discountName : null,
    offerMyClub : false,
    idBBR : null,
    clientRut : null
  };




  /*
  + Manejo de orden de compra
  */

  inicialice(): Observable<boolean> {
    return this.eessService.getEessData(this.orden.qr)
      .pipe(map(res => {
        return this.setInitialData(res, this.orden.qr);
      }));
  }



  check(): Observable<boolean> {
    if (!environment.production) {
      console.log('check(): qr = ', this.orden.qr);
    }

    if (this.orden.qr === '') {

      if (!environment.production) {
        return of(false);
        console.log('No hay QR en la orden - se lee desde el storage solo <develpment mode>'); // TODO FECHA
        // For development ONLY
        this.orden.qr = this.getCartQRfromStorage();

        if (this.orden.qr !== '') {
          return this.eessService.getEessData(this.orden.qr).pipe(map(res => {
            return this.setInitialData(res, this.orden.qr);
          }));

        } else {
          console.log('check(): storage QR false.');
          this.remove();
          return of(false);
        }
      } else {
        console.log('Error en la inicialización de la orden.');
        return of(false);
      }

    } else {
      return of(true);
    }

  }


  checkIntoSeleccion(): Observable<boolean> {
    const now = new Date();
    const ttl = localStorage.getItem('ttl');
    if (environment.verbose) { console.log('ttl: ', ttl);  }
    if (!ttl){
      return of(false);
    } 

    if (now.getTime() > Number(ttl)) {
      Utils.removePartialLocalStorage(`${environment.cartQR}`);
      console.log('El almacenamiento local ha expirado.');
      return of(false);
    }

    const ordenLocalRaw = localStorage.getItem('orden');
    if (ordenLocalRaw) {
      try {
        const ordenLocal: Orden = JSON.parse(ordenLocalRaw);
        this.orden = ordenLocal;
      } catch (error) {
        console.log('Error en cast de la orden en el componente selección');
        return of(false);
      }
    } 
    /*
    else {
      if (!this.orden.qr || this.orden.qr === '') {
        console.log('Error en la inicialización de la orden en el componente selección');
        return of(false);

      } else { // se buscan los datos nuevamente si es posible
        this.eessService.getEessData(this.orden.qr).subscribe(x => {
          if (x) {
            if (this.setInitialData(x, this.orden.qr)) {
              if (environment.verbose) {
                console.log('Startup() setInitialData selección', x);
              }
              return of(true);
            } else {
              return of(false);
            }
          } else {
            return of(false);
          }

        }, err => {
          console.log('Error no es posible acceder al servicio desde seleccion. Sin acceso a datos.', err);
          return of(false);
        }
        );
      }
    } */
    if (this.orden.qr === '') {
      console.log('Error en la inicialización de la orden.');
      return of(false);
    } else {
      return of(true);
    }

  }



  getEstado(): Estado {
    return Estado.INICIADO;
  }


  private createId(): any {
    try {
      return Math.floor(Math.random() * 100);
    } catch (error) {
      console.error(error);
    }
    return null;
  }


  getOrden(): Orden {
    return this.orden;
  }


  /**
   * Saves orden service
   * Solo !environment.production
   * @param orden guarda el qr solamente
   * @returns true if save
   */
  save(orden: Orden): boolean {
    try {
        const now = new Date();
        localStorage.setItem('ttl', now.getTime() + `${environment.storageTimeToLive}`);
        localStorage.setItem(`${environment.cartQR}`, orden.qr);
        localStorage.setItem('orden', JSON.stringify(this.orden));
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }

  getCartQRfromStorage(): any {
    try {
      return localStorage.getItem(`${environment.cartQR}`);
    } catch (error) {
      console.error(error);
    }
  }

  remove(): boolean {
    try {
      // localStorage.removeItem(`${environment.cartQR}`);
      Utils.removePartialLocalStorage(`${environment.cartQR}`);
      this.orden.id = '-1';
      this.orden.qr = '';
      this.orden.estado = Estado.INICIADO;
      this.orden.eessAndProductos = [];
      this.orden.monto = 0;
      this.orden.mediopago = null;
      this.orden.mediopagoid = null;
      this.orden.propina = 0;
      this.orden.productosDisponibles = [];
      this.orden.productoSeleccionado = null;
      this.orden.eessId = null;
      this.orden.eessName = null;
      this.orden.card = null;
      this.orden.pagoResponseOcm = null;
      this.orden.fusionStatusResponse = null;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  status(): Estado {
    return this.orden.estado;
  }

  setStatus(estado: Estado): void {
    this.orden.estado = estado;
  }






  setInitialData(data: EessAndProducto[], qr: string): boolean {

    this.orden = {
      id: '-2',
      qr: '',
      estado: Estado.SELECCIONANDO,
      eessAndProductos: [],
      monto: 0,
      mediopago: null,
      mediopagoid: null,
      propina: 0,
      productosDisponibles: [],
      productoSeleccionado: null,
      eessId: null,
      eessName: null,
      fpdeviceid: null,
      card: null,
      pagoResponseOcm: null,
      pagoResponseWpy: null,
      pagoResponseChek: null,
      pagoResponseCash: null,
      fusionStatusResponse: null,
      cardType: 'DEBITO', // default value
      stepper: 0,
      discount: null,
      maxAmount: null,
      offerList: null,
      offerValidate: null,
      discountAlliance : null,
      offer : null,
      discountName : null,
      offerMyClub : false,
      idBBR : null,
      clientRut : null
    };

    if (data[0]) {
      this.orden.qr = qr;
      this.orden.eessId = data[0].ideess;
      this.orden.eessName = data[0].nombrefantasia;
      if (data[0].fpdeviceid) {
        this.orden.fpdeviceid = data[0].fpdeviceid;
      }
      this.whichProducts(data);
      if (!this.orden.qr || this.orden.qr === '' || !this.orden.eessId) {
        if (!environment.production) {
          console.log('La orden no es correcta: ', this.orden);
        }
        return false;
      }
      this.save(this.orden);
      return true;
    } else {
      return false;
    }
  }


  /* +++++++++++++++++++++++++++++ +++++++++ ++++++++++++++++++++++++++++++ */
  /* +++++++++++++++++++++++++++++ productos ++++++++++++++++++++++++++++++ */
  /* +++++++++++++++++++++++++++++ +++++++++ ++++++++++++++++++++++++++++++ */
  private whichProducts(data: EessAndProducto[]): void {
    data.forEach(obj => {
      if (!this.productConversionHelper(obj)) {
        console.log('Existe un producto no identificado: ', obj.productname);
      }
    });
  }
  private productConversionHelper(input: EessAndProducto): boolean {
    const name = input.frontend_productname;
    let existe = false;

    switch (name.toUpperCase()) {
      case ProductoEnum.DIESEL:
        this.orden.productosDisponibles?.push(ProductoEnum.DIESEL);
        existe = true;
        break;
      case ProductoEnum.NOVENTA3:
        this.orden.productosDisponibles?.push(ProductoEnum.NOVENTA3);
        existe = true;
        break;
      case ProductoEnum.NOVENTA5:
        this.orden.productosDisponibles?.push(ProductoEnum.NOVENTA5);
        existe = true;
        break;
      case ProductoEnum.NOVENTA7:
        this.orden.productosDisponibles?.push(ProductoEnum.NOVENTA7);
        existe = true;
        break;
    }
    if (existe) {
      this.orden.eessAndProductos?.push(input);
      return true;
    } else {
      return false;
    }
  }
  productoFromProductEnum(productEnum: ProductoEnum): EessAndProducto | null {
    const pd = this.orden.eessAndProductos;
    if (pd) {
      for (const entry of pd) {
        if (entry.frontend_productname === productEnum) {
          return entry;
        }
      }
      return null;
    } else {
      return null;
    }
  }
  hasProduct(producto: ProductoEnum): boolean {
    const pd = this.orden.productosDisponibles;
    if (pd) {
      for (const entry of pd) {
        if (entry === producto) {
          return true;
        }
      }
      return false;
    }
    return false;
  }
  /* +++++++++++++++++++++++++++++ +++++++++ ++++++++++++++++++++++++++++++ */



  public saveOrdenToLocalStorage(stepperIndex: number | null): void {
    if (stepperIndex) {
      this.orden.stepper = stepperIndex; // + 1;
    }
    this.save(this.orden);
    if (environment.verbose){
      // console.log('orden', JSON.stringify(this.orden));
    }
  }



}
