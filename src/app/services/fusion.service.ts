import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse';
import { FusionState } from '../model/FusionState';
import { FusionStatusResponse } from '../model/FusionStatusResponse';
import { catchError, map, takeWhile, timeout } from 'rxjs/operators';
import { StatusTbkInscripcion } from '../model/StatusTbkInscripcion';
import Utils from '../shared/Utils';
import { OrdenService } from './orden.service';
import { GeneralStatusResponse } from '../model/GeneralStatusResponse';

@Injectable({
  providedIn: 'root'
})
export class FusionService {

  constructor(private httpClient: HttpClient, private ordenService: OrdenService) { }


  /**
   * Estado de una carga
   * Retrive status
   * frontendid
   */

  private getCargaInscripcionStatus(frontendid: string): void {
    const input: object = {
      frontendid
    };

    this.httpClient.post(`${environment.tbkApiUrl}` + '/inscriptionstatus', input)
      .subscribe(
        (val) => {
         
          /*
          inscriptionstatus	 0 -> Ok,
                             menor que 0 -> resuelta con error,
                             1313 -> ESPERANDO RESPUESTA,
                             1414 -> tbk_token NOT FOUND
          message	Mensaje de error
          elapsedtime	Milisegundos  */
          try {
              
            const result = Utils.jsendHelper(val as ApiResponse) as StatusTbkInscripcion;

            if (!environment.production) {
              console.log('result:', result.message);
              console.log('inscriptionstatus = ', result?.inscriptionstatus);
            }

            /*             if (result?.inscriptionstatus === 0) {
                          this.isInscripcionAlive = false;
                          this.inscripcionSubscription.unsubscribe();
                          this.openedInscriptionWindow?.close();

                        } else if (result?.inscriptionstatus === 1414 || result?.inscriptionstatus < 0) {
                          this.isInscripcionAlive = false;
                          this.inscripcionSubscription.unsubscribe();
                          this.openedInscriptionWindow?.close();
                          console.log('NO se ha podido realizar la inscripción');
                        } */

          } catch (error) {
            console.log(error);
          }

        },
        response => {
          console.log('POST call in error', response);
        }
      );

  }




  /**
   * Eventos Fusion
   * Retrive status
   * frontendid
   */

  statusByFrontendId(frontendid: string): any {
    const input: object = {
      frontendid
    };
    return this.getFusionStatus(input);
  }

  statusByTrxId(trxid: string): void {
    const input: object = {
      trxid
    };
    this.getFusionStatus(input);
  }


  private getFusionStatus_byStatus(input: object): void {

    let operation = '';
    if (input.hasOwnProperty('frontendid')) {
      operation = '/statusbyfrontendid';
    }
    if (input.hasOwnProperty('trxid')) {
      operation = '/statusbytrxid';
    }

    this.httpClient.post(`${environment.apiFusion}` + operation, input)
      .subscribe(
        (val) => {
          /*
          inscriptionstatus	 0 -> Ok,
                   menor que 0 -> resuelta con error,
                          1313 -> ESPERANDO RESPUESTA,
                          1414 -> tbk_token NOT FOUND
          message	Mensaje de error
          elapsedtime	Milisegundos  */
          try {

            const result = Utils.jsendHelper(val as ApiResponse) as FusionStatusResponse;

            if (!environment.production) {
              console.log('result:', result);
              console.log('status = ', result?.estadoactual);
            }

            /*             if (result?.inscriptionstatus === 0) {
                          this.isInscripcionAlive = false;
                          this.inscripcionSubscription.unsubscribe();
                          this.openedInscriptionWindow?.close();

                        } else if (result?.inscriptionstatus === 1414 || result?.inscriptionstatus < 0) {
                          this.isInscripcionAlive = false;
                          this.inscripcionSubscription.unsubscribe();
                          this.openedInscriptionWindow?.close();
                          console.log('NO se ha podido realizar la inscripción');
                        } */

          } catch (error) {
            console.log(error);
          }

        },
        response => {
          console.log('POST call in error', response);
        }
      );

  }


  getFusionStatus(input: object): Observable<any> {
    let action = '/statusbytrxid';
    if (input.hasOwnProperty('frontendid')) {
      action = '/statusbyfrontendid';
    }

    return this.httpClient.post<any>(`${environment.apiFusion}` + action, input)
      .pipe(
        map((response: any) => {  // return the modified data:
          try {
            // return Utils.jsendHelper(response as ApiResponse); // kind of useless
            const result = Utils.jsendHelper(response as ApiResponse) as FusionStatusResponse;
            if (result) {
              this.ordenService.orden.fusionStatusResponse = result;
              // const letColorString = result.estadoactual;
              return result.estadoactual;
            }
            return null;
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
            return null;
          }
        })
      ).pipe(
        catchError(err => {
          console.log('Handling error locally and rethrowing it...', err);
          return 'ERROR';
        })
      );

/*     return this.httpClient.post<string>(`${environment.apiFusion}` + action, input)
      .pipe(
        map((response: any) => {
          try {
            const result = Utils.jsendHelper(response as ApiResponse) as FusionStatusResponse;

            if (!environment.production) {
              console.log('Estado:', result.estadoactual);
            }

            const letColorString = result.estadoactual;
            const estadoactual = letColorString as keyof typeof FusionState;

            return result.estadoactual;
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
            return null;
          }
        })
      ).pipe(
        catchError(this.handleError)
      ); */

  }


  getFusionStatusResult(): Observable<FusionStatusResponse> {
    const frontendid = localStorage.getItem('FRONTENDID');
    const input: object = {
      frontendid
    };
    const action = '/statusbyfrontendid';

    return this.httpClient.post<FusionStatusResponse>(`${environment.apiFusion}` + action, input)
      .pipe(
        map((response: any) => {
          try {
            return Utils.jsendHelper(response as ApiResponse);
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
          }
        })
      ).pipe(
        catchError(this.handleError)
      );

  }



  /**
  * Obtienen el estado general de un frontendid
  * Retrive status
  * 
  * /frontend/generalstatus
  */
   generalStatus(frontendid: string): Observable<GeneralStatusResponse> {

    if (!frontendid) {
      console.log('Es necesario contar con frontendid para conocer el estado general');
    }
    const input: object = {
      frontendid
    };

    return this.httpClient.post<GeneralStatusResponse>(`${environment.apiEessReserveUrl}` + 'frontend/generalstatus', input) // /frontend/
      .pipe(
        map((response: any) => {
          try {
            return Utils.jsendHelper(response as ApiResponse);
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
          }
        })
        , catchError(error => {
          return throwError(error);
        })
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
