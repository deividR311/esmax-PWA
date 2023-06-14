import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, interval, ReplaySubject, Subject } from 'rxjs';
import { map, takeWhile, timeout } from 'rxjs/operators';
// environment
import { environment } from '@env/environment';

import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, Subscription } from 'rxjs';
import { Card } from 'src/app/model/Card';
import Utils from 'src/app/shared/Utils';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { Orden } from 'src/app/model/Orden';
import { ResponseSmxocmPagar } from 'src/app/model/ResponseSmxocmPagar';
import { StatusTbkInscripcion } from 'src/app/model/StatusTbkInscripcion';
import { Eess } from '../model/Eess';
import { InterceptorSkipHeader } from './interceptorHttp.service';
import { EessAndProducto } from '../model/EessAndProducto';
import { StatusTbkWebPayPay } from '../model/StatusTbkWebPayPay';

@Injectable({
  providedIn: 'root'
})
export class TransbankService {

  constructor(private httpClient: HttpClient) { }

  public openedInscriptionWindow: any;
  // private responseUrl = 'http://200.54.213.238:3000/callback-inscripcion';
  public isInscripcionAlive = false;
  // 25-2
  // private inscripcionInProgress$ = new BehaviorSubject<boolean>(false); // {1}
  public inscripcionSubscription!:Subscription;

  // ----------------------------------------- EventEmitter -------------------
  // invokeFirstComponentFunction = new EventEmitter();
  // subsVar: Subscription | undefined;
  // --------------------------------------------------------------------------


  private inscriptionIng$ = new Subject<boolean>(); // BehaviorSubject<boolean>(false);

  get isInscriptionIngObservable(): Observable<boolean> {
    return this.inscriptionIng$.asObservable(); // {2}
  }

  // webpay --------------------------------------------------
  public isWebPayAlive = false;
  public openedWebPayWindow: any;
  public webPaySubscription!: Subscription;
  private webPayIng$ = new Subject<boolean>(); // BehaviorSubject<boolean>(false);

  get isWebPayIngObservable(): Observable<boolean> {
    return this.webPayIng$.asObservable(); // {2}
  }




  /**
   * Inscripcion tarjeta One Click Mall
   */
  public tbkInscripcionApi(rut: string, email: string, cardtype: string, win: Window | null): void {

    /* if (this.openedInscriptionWindow){ // reintento
      this.openedInscriptionWindow = window.open('', '_blank');
    } */

    /*     if (this.openedInscriptionWindow) {
          this.inscriptionIng$.next(true);
        } else {
          console.log('No se puedo abrir una ventana. Permita las venanas emergentes en su navegador.');
        } */


    this.httpClient.post<any>(`${environment.tbkApiUrl}` + '/inscription',
      { rut, email, cardtype },
      // { headers: tbkHeaders }
    )
      .subscribe(
        (val) => {
          
          const result = Utils.jsendHelper(val as ApiResponse);
          if (!environment.production) { console.log('result', result); }

          if (!result && !result?.url_webpay && !result?.token) {
            alert('Ha ocurrido un error con la inscripción.');

          } else {
            const urlparam = result.url_webpay + '?TBK_TOKEN=' + result.TBK_TOKEN;
            if (!environment.production) {
              console.log('urlparam: ', urlparam);
            }
            // this.openedInscriptionWindow = window.open(urlparam, '_blank');


            /* // GP 20-5-2021
            if (this.openedInscriptionWindow) { // A reference to the newly created window, or null if the call failed
              this.openedInscriptionWindow.location = urlparam;
            } else {
              alert('No se ha podido abrir la ventana de Transbank');
              return;
            } */
            // this.openedInscriptionWindow = window.open(urlparam, '_blank');
            // this.openedInscriptionWindow = window.open('', '_blank');
            if (win) {
              this.openedInscriptionWindow = win;
              win.location.href = urlparam;
              win.focus();
            } else {
              alert('Su navegador impide abrir la ventana de Transbank.');
              return;
            }

            // start polling inscripción
            if (result?.TBK_TOKEN) {
              this.pollingInscripcion(result.TBK_TOKEN);
            }

            //  interval(3000).subscribe(x => {
            //    openedInscriptionWindow?.close();
            //  });
          }
        },
        response => {
          console.log('POST call in error', response);
        }
        /*         ,
                () => {
                  console.log('The POST observable is now completed.');
                } */
      );
  }

  /**
   * Inscripcion tarjeta One Click Mall
   * Polling internal service
   */
  private pollingInscripcion(token: string): void {

    const frecuenciaInscripcion = environment.tbkInscripcionFrecuencia;
    const timeOutInscripcion = environment.tbkInscripcionTimeOut;
    this.isInscripcionAlive = true;
// let onSizeChangeSetInterval: ReturnType<typeof setInterval> | undefined;
    this.inscripcionSubscription = interval(frecuenciaInscripcion).pipe(
      timeout(timeOutInscripcion),
      takeWhile(() => this.isInscripcionAlive),
      // takeUntil(this.onDestroy$)
    ).subscribe(() => {
      // fun();
      if (!environment.production) {
        console.log(`Servicio consulta de status para: ${token}`);
      }
      this.getInscripcionStatus(token);
    });
  }

  /**
   * Inscripcion tarjeta One Click Mall
   * Retrive status
   */
  private getInscripcionStatus(tbkToken: string): void {
    const input: object = {
      tbk_token: tbkToken
    };

    // console.log(' isclosed?: ', this.openedInscriptionWindow?.closed);
    // console.log('  location: ', this.openedInscriptionWindow?.location);

    this.httpClient.post(`${environment.tbkApiUrl}` + '/inscriptionstatus', input)
      .subscribe(
        (val) => {
          /*
          inscriptionstatus	 0 -> Ok,
                             menor que 0 -> resuelta con error,
                             1313 -> ESPERANDO RESPUESTA,
                             1414 -> tbk_token NOT FOUND
          message
          elapsedtime	Milisegundos  */
          try {
           
            const result = Utils.jsendHelper(val as ApiResponse) as StatusTbkInscripcion;

            if (!environment.production) {
              console.log('result:', result?.message);
              console.log('inscriptionstatus = ', result?.inscriptionstatus);
            }
            /*             const isDeadCode = false;
                        if (!environment.production && !isDeadCode) {
                          // TESTING
                          console.log('-- SE INTERRUMPE POLLING --');
                          // this.invokeFirstComponentFunction.emit(); // <----
                          this.isInscripcionAlive = false;
                          this.inscripcionSubscription.unsubscribe();
                          this.inscriptionIng$.next(false);
                          this.openedInscriptionWindow?.close();
                          return;
                        } */

            if (result?.inscriptionstatus === 0) {
              this.isInscripcionAlive = false;
              this.inscripcionSubscription.unsubscribe();
              this.inscriptionIng$.next(true); // termina ok
              // this.invokeFirstComponentFunction.emit(); // <----
              this.openedInscriptionWindow?.close();

            } else if (result?.inscriptionstatus === 1414 || result?.inscriptionstatus < 0) {
              this.isInscripcionAlive = false;
              this.inscripcionSubscription.unsubscribe();
              this.inscriptionIng$.next(false);
              this.openedInscriptionWindow?.close();
              console.log('NO se ha podido realizar la inscripción');
            }

          } catch (error) {
            console.log(error);
          }

        },
        response => {
          console.log('POST call in error', response);
        }
        /*         ,
                () => {
                  console.log('The POST observable is now completed.');
                } */
      );

  }




  /**
   * Pago tarjeta WebPay  ...............................................---------------------
   */
  public tbkWebPay21092021(orden: Orden, token: string, uuid: string, win: Window | null): void {

    const input: object = {
      frontendid: uuid,
      productno: orden.productoSeleccionado?.productno,
      monto: orden.monto,
      propina: orden.propina,
      cardtype: orden.cardType
    };
    if (!environment.production) { console.log('tbkWebPay input: ', input); }

    this.httpClient.post<ApiResponse>(`${environment.apiTbkWebPayPay}` + '', input)
      .subscribe(
        (val) => {
          const result = Utils.jsendHelper(val as ApiResponse);
          if (!environment.production) { console.log('result', result); }

          if (!result && !result.redirect_url && !result.token_ws) {
            alert('Ha ocurrido un error con el pago Transbank WebPay.');


          } else {
            const urlparam = result.redirect_url + '?TBK_TOKEN=' + result.token_ws;

            if (win) {
              // Create form to send a transbank
              const form = win.document.createElement('form');
              form.method = 'post';
              form.action = result.redirect_url;
              const hiddenField = win.document.createElement('input');
              hiddenField.type = 'hidden';
              hiddenField.name = 'token_ws';
              hiddenField.value = result.token_ws;
              form.appendChild(hiddenField);
              win.document.body.appendChild(form);
              form.submit();
              this.openedWebPayWindow = win;
              // win.location.href = urlparam;
              win.focus();
            } else {
              alert('Su navegador impide abrir la ventana de Transbank.');
              return;
            }

            // start polling inscripción
            if (result?.token_ws) {
              this.pollingWebPay(result.token_ws);
            }

            //  interval(3000).subscribe(x => {
            //    openedInscriptionWindow?.close();
            //  });
          }
        },
        response => {
          return false
          console.log('POST call in error', response);
        }
        /*         ,
                () => {
                  console.log('The POST observable is now completed.');
                } */
      );
  }

  /**
   * Pago tarjeta WebPay  ...............................................---------------------
   */
   public tbkWebPay(orden: Orden, uuid: string, win: Window | null, discountTotal : number): Observable<boolean> {
    const discount = orden.productoSeleccionado.price - orden.discount;

    const input: object = {
      frontendid: uuid,
      productno: orden.productoSeleccionado?.productno,
      monto: orden.monto,
      // propina: orden.propina,
      cardtype: orden.cardType,
      discount: orden.discount ? Number(discount) : 0,
      discountName: orden.discount ? orden.discountName : '',
      discountTotal: orden.discount ? discountTotal : 0,
      discountAlliance: orden.discount ? orden.discountAlliance : ''
    };
    
    if (!environment.production) { console.log('tbkWebPay input: ', input); }

    return this.httpClient.post<ApiResponse>(`${environment.apiTbkWebPayPay}` + '', input)

        .pipe(
          map((val: any) => {
            try {
              const result = Utils.jsendHelper(val as ApiResponse);
              if (!environment.production) { console.log('result', result); }
              if (!result && !result.redirect_url && !result.token_ws) {
                alert('Ha ocurrido un error con el pago Transbank WebPay.');
                console.log('Ha ocurrido un error con el pago Transbank WebPay.');
              } else {
                localStorage.setItem('TBK_TOKEN', result.token_ws);
                const urlparam = result.redirect_url + '?TBK_TOKEN=' + result.token_ws;
                if (win) {
                  // Create form to send a transbank
                  const form = win.document.createElement('form');
                  form.method = 'post';
                  form.action = result.redirect_url;
                  const hiddenField = win.document.createElement('input');
                  hiddenField.type = 'hidden';
                  hiddenField.name = 'token_ws';
                  hiddenField.value = result.token_ws;
                  form.appendChild(hiddenField);
                  win.document.body.appendChild(form);
                  form.submit();
                  this.openedWebPayWindow = win;
                  // win.location.href = urlparam;
                  win.focus();
                } else {
                  alert('Su navegador impide abrir la ventana de Transbank.');
                  console.log('Su navegador impide abrir la ventana de Transbank.');
                }
    
                // start polling inscripción
                if (result?.token_ws) {
                  this.pollingWebPay(result.token_ws);
                  return true;
                }
              }
              return false;
            } catch (error) {
              console.log('Error se esperada ApiResponse: ', error);
              return false;
            }
          })
        ).pipe(
          catchError(this.handleError)
        )
  }

  /**
   * Polling Web Pay
   * Polling internal service
   */
  private pollingWebPay(token: string): void {

    const frecuenciaWebpay = environment.tbkTbkWebPayFrecuencia;
    const timeOutWebpay = environment.tbkTbkWebPayTimeOut;
    this.isWebPayAlive = true;

    this.webPaySubscription = interval(frecuenciaWebpay).pipe(
      timeout(timeOutWebpay),
      takeWhile(() => this.isWebPayAlive),
    ).subscribe(() => {
      if (!environment.production) {
        console.log(`Servicio consulta de status para webPay: ${token}`);
      }
      this.tbkPagarWebpayStatus(token);
    });
  }


  
  public pollingWebPayFromRefresh(token: string): Subscription {

    const frecuenciaWebpay = environment.tbkTbkWebPayFrecuencia;
    const timeOutWebpay = environment.tbkTbkWebPayTimeOut;
    this.isWebPayAlive = true;

    this.webPaySubscription = interval(frecuenciaWebpay).pipe(
     
      // map(
      timeout(timeOutWebpay),
      takeWhile(() => this.isWebPayAlive)
      // )
    ).subscribe(() => {
      if (!environment.production) {
        console.log(`Servicio consulta de status para webPay: ${token}`);
      }
      this.tbkPagarWebpayStatus(token);
    });

    return this.webPaySubscription;

  }




  /**
   * Tbks pagar one click
   * @param orden orden de compra
   * @param token access_token
   * @returns pagar one click
   * Requiere bearer
   * Requiere uuid
   */
  tbkPagarOneClick(orden: Orden, uuid: string, discountTotal : number): Observable<ApiResponse | null> {
    const discount = orden.productoSeleccionado.price - orden.discount;
    
    const input: object = {
      internalid: orden.card?.internalid,
      productno: orden.productoSeleccionado?.productno,
      monto: orden.monto,
      // propina: orden.propina,
      frontendid: uuid,
      discount: orden.discount ? Number(discount) : 0,
      discountName: orden.discount ? orden.discountName : '',
      discountTotal: orden.discount ? discountTotal : 0,
      discountAlliance: orden.discount ? orden.discountAlliance : ''
    };

    if (!environment.production) {
      console.log('tbkPagarOneClick input: ', input);
    }

    return this.httpClient.post<ApiResponse>(`${environment.apiTbkOneClickPay}` + '', input)
      .pipe(
        map((response: any) => {  // return the modified data:
          try {
            return response as ApiResponse;
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
            return null;
          }
        })
      ).pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Tbks pagar chek 
   * @param orden orden de compra
   * @param token access_token
   * @returns pagar one chek
   * Requiere bearer
   * Requiere uuid
   */
   tbkPagarChek(orden: Orden, uuid: string, telefono: string, discountTotal : number): Observable<ApiResponse | null> {
    const discount = orden.productoSeleccionado.price - orden.discount;
    const input: object = {
      internalid: orden.card?.internalid,
      productno: orden.productoSeleccionado?.productno,
      monto: orden.monto,
      cardType:orden.cardType,
      // propina: orden.propina,
      frontendid: uuid,
      discount: discount ? Number(discount) : 0,
      discountName: orden.discount ? orden.discountName : '',
      discountTotal: orden.discount ? discountTotal : 0,
      discountAlliance: orden.discount ? orden.discountAlliance : '',
      telefono : telefono
    };
    if (!environment.production) {
      console.log('tbkPagarOneClick input: ', input);
    }

    return this.httpClient.post<ApiResponse>(`${environment.apiChekPay}` + '', input)
      .pipe(
        map((response: any) => {  // return the modified data:
          try {
            return response as ApiResponse;
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
            return null;
          }
        })
      ).pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Tbks pagar web pay
   * @param orden orden de compra
   * @param token access_token
   * @returns pagar web pay
   * Requiere bearer
   * Requiere uuid
   */
  tbkPagarWebpay(orden: Orden, token: string, uuid: string): Observable<ApiResponse | null> {
    /*
      "frontendid": "22224E99-0000-4F78-0000-000003354E56",
      "productno": 1,
      "monto": 10000,
      "propina": 1000,
      "cardtype": "DEBITO"
    */
    const input: object = {
      frontendid: uuid,
      productno: orden.productoSeleccionado?.productno,
      monto: orden.monto,
    //  propina: orden.propina,
      cardtype: orden.cardType
    };
    if (!environment.production) {
      console.log('tbkPagarWebpay input: ', input);
    }
    return this.httpClient.post<ApiResponse>(`${environment.apiTbkWebPayPay}` + '', input)
      .pipe(
        map((response: any) => {  // return the modified data:
          try {
            return response as ApiResponse;
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
            return null;
          }
        })
      ).pipe(
        catchError(this.handleError)
      );
  }

  private tbkPagarWebpayStatus(tbkToken: string): void {
    const input: object = {
      token_ws: tbkToken
    };

    this.httpClient.post(`${environment.apiTbkWebPayStatusPay}`, input)
      .subscribe(
        (val) => {
          /*
            paymentstatus = 1313: Esperando respuesta
            paymentstatus = 0: TRANSACCION APROBADA
            paymentstatus < 0: Finalizada con error
          */
          try {
            const result = Utils.jsendHelper(val as ApiResponse) as StatusTbkWebPayPay;

            if (!environment.production) {
              console.log('paymentstatus = ', result?.paymentstatus);
            }
            if (result?.paymentstatus === 0) {
              this.isWebPayAlive = false;
              this.webPaySubscription.unsubscribe();
              this.webPayIng$.next(true); // termina ok
              // this.webPayIng$.complete();
              // 24- 11 localStorage.setItem('TRXID', result?.trxid + '');
              this.openedWebPayWindow?.close();

            } else if (result?.paymentstatus < 0) {
              this.isWebPayAlive = false;
              this.webPaySubscription.unsubscribe();
              this.webPayIng$.next(false); // termina Nok
              // this.webPayIng$.complete();
              this.openedWebPayWindow?.close();
              console.log('NO se ha podido realizar el pago web pay');
            }

          } catch (error) {
            console.log(error);
          }

        },
        response => {
          console.log('POST call in error', response);
        }
        /*         ,
                () => {
                  console.log('The POST observable is now completed.');
                } */
      );

  }











  /* +++++++++++++++++++++++ cards services +++++++++++++++++++++++  */
  /* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  */
  tbkListCards(rut: string, token: string): Observable<Card[]> {
    const input: object = {
      rut
    };
    /*     let apiHeaders = new HttpHeaders();
        apiHeaders = apiHeaders
          .set('Content-Type', 'application/json')
          .set('smxauthorization', `Bearer ${token}`); */

    return this.httpClient.post<Card[]>(`${environment.apiTbkCardsUrl}` + 'listcards', input)
      .pipe(
        map((response: any) => {  // return the modified data:
          try {
            return Utils.jsendHelper(response as ApiResponse); // kind of useless
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
          }
        })
      ).pipe(
        catchError(this.handleError)
      );
  }

  tbkDeleteCard(card: Card): Observable<boolean> {
    const input: object = {
      internalid: card.internalid
    };
    if (!environment.production) {
      console.log('tbkDeleteCard input: ', input);
    }

    return this.httpClient.post<boolean>(`${environment.apiTbkOneClickDelete}` + '', input)
      .pipe(
        map((response: any) => {
          try {
            const result = Utils.jsendHelper(response as ApiResponse);
            if (result) {
              return true;
            }
            return false;
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
            return false;
          }
        })
      ).pipe(
        catchError(this.handleError)
      );
  }

  tbkSetFavCard(card: Card, rut: string): Observable<boolean> {
    const input: object = {
      rut,
      internalid: card.internalid
    };
    if (!environment.production) {
      console.log('updatedefault input: ', input);
    }

    return this.httpClient.post<boolean>(`${environment.apiTbkCardsUrl}` + 'smxocm/updatedefault', input)
      .pipe(
        map((response: any) => {
          try {
            const result = Utils.jsendHelper(response as ApiResponse);
            if (result) {
              return true;
            }
            return false;
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
            return false;
          }
        })
      ).pipe(
        catchError(this.handleError)
      );
  }






  testOpenWindow(qr: string): Observable<EessAndProducto[]> {
    this.openedInscriptionWindow = window.open('', '_blank');

    // tslint:disable-next-line:max-line-length
    qr = '9fd8931b6735f3111bc5328637bc1e2b4d71db910057d223f78975a22e39c47f9806fe9fbc2583f8acd060fd1bc661e5e4f414fef6761388cabf9cfadc5e09';
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.get<Eess[]>(`${environment.apiEessServiceUrl}` + 'qr/' + qr, { headers })
      .pipe(
        map((response: any) => {  // NOTE: response is of type SomeType
          // return the modified data:
          try {
            const algo = Utils.jsendHelper(response as ApiResponse) as EessAndProducto[];

            const url = 'https://www.google.cl/search?q=' + algo[0].codigogilbarco;
            console.log('---url-<>', url);
            // this.openedInscriptionWindow = window.open(url , '_blank');

            this.openedInscriptionWindow.location = url;

            // this.openedInscriptionWindow = window.open();
            // this.openedInscriptionWindow.location = urlparam;

            if (this.openedInscriptionWindow) { // A reference to the newly created window, or null if the call failed
              // start polling inscripción
              console.log('estamos bien');
            } else {
              alert('No se ha podido abrir la ventana !!!!!!');
            }
            return Utils.jsendHelper(response as ApiResponse);
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
          }
        })
        /* , catchError(error => {
          return throwError(error); // From 'rxjs'
        }) */
      )
      /*       .pipe(
              catchError(this.handleError)
            ) */
      ;
  }
  /**
   * Transbank inscripcion api
   * username
   * email
   */
  public tbkInscripcionApi_direct(username: string, email: string): void {

    /*     let tbkHeaders = new HttpHeaders();
        tbkHeaders = tbkHeaders
          .set('Content-Type', 'application/json')
          .set('Tbk-Api-Key-Id', `${environment.tbkApiKeyId}`)
          .set('Tbk-Api-Key-Secret', `${environment.tbkApiKeySecret}`);

        this.httpClient.post<any>(`${environment.tbkInscripcionsUrl_deprecated}`,
          {
            username,
            email,
            response_url: this.responseUrl
          },
          // tslint:disable-next-line:object-literal-shorthand
          { headers: tbkHeaders }
        )
          .subscribe(
            (val) => {
              const urlparam = val.url_webpay + '?TBK_TOKEN=' + val.token;

              if (!environment.production) {
                console.log('urlparam: ', urlparam);
                console.log('Open Tranbank window');
              }
              this.openedInscriptionWindow = window.open(urlparam, '_blank');
              // start polling inscripción
              this.pollingInscripcion(username);

              //  interval(3000).subscribe(x => {
              //    openedInscriptionWindow?.close();
              //  });
            },
            response => {
              console.log('POST call in error', response);
            },
            () => {
              console.log('The POST observable is now completed.');
            }); */
    // return this.httpClient.post(url, content, { headers: headers })
    //  .pipe(
    //     catchError(this.handleError)
    // );
  }

  public tbkInscripcionApi_inicial(rut: string, email: string): void {
    // email = 'correo@alterado.com'; // TODO DUMMY !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    /*  let tbkHeaders = new HttpHeaders();
    tbkHeaders = tbkHeaders
      .set('Content-Type', 'application/json')
      .set('Tbk-Api-Key-Id', `${environment.tbkApiKeyId}`)
      .set('Tbk-Api-Key-Secret', `${environment.tbkApiKeySecret}`);
    */
    this.httpClient.post<any>(`${environment.tbkApiUrl}` + '/inscription',
      { rut, email },
      // { headers: tbkHeaders }
    )
      .subscribe(
        (val) => {
          const result = Utils.jsendHelper(val as ApiResponse);
          if (!environment.production) { console.log('result', result); }

          if (!result && !result.url_webpay && !result.token) {
            alert('Ha ocurrido un error con la inscripción.');

          } else {
            const urlparam = result.url_webpay + '?TBK_TOKEN=' + result.TBK_TOKEN;
            if (!environment.production) {
              console.log('urlparam: ', urlparam);
            }
            this.openedInscriptionWindow = window.open(urlparam, '_blank');
            // this.openedInscriptionWindow = window.open();
            // this.openedInscriptionWindow.location = urlparam;

            if (this.openedInscriptionWindow) { // A reference to the newly created window, or null if the call failed
              // start polling inscripción
              this.pollingInscripcion(result.TBK_TOKEN);
            } else {
              alert('No se ha podido abrir la ventana de Transbank');
            }

            //  interval(3000).subscribe(x => {
            //    openedInscriptionWindow?.close();
            //  });
          }
        },
        response => {
          console.log('POST call in error', response);
        }
        /*         ,
                () => {
                  console.log('The POST observable is now completed.');
                } */
      );
  }



  /*
      private handleError +++++++++++++++++++++++++++++++++++++++++++++++++++++
  */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(
        `Backend returned code ${error.status}, ` +
        `body: ${error.message}`);
      // console.log('Backend returned: ', error.error.message);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }


}
