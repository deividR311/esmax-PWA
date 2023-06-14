import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../model/ApiResponse';
import { Eess } from '../model/Eess';
import { EessAndProducto } from '../model/EessAndProducto';
import Utils from '../shared/Utils';
import { InterceptorSkipHeader } from './interceptorHttp.service';


/*
+ Servicios relacionados con la estación de servicio
*/

@Injectable({
  providedIn: 'root'
})
export class EessService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Obtiene toda la data disponible de un estación
   * Retrive status
   * qr
   */
  getEessData(qr: string): Observable<EessAndProducto[]> {
    /*
    if (!environment.production) {
      const qr1 = '9fd8931b6735f3111bc5328637bc1e2b4d71db910057d223f78975a22e39c47f9806fe9fbc2583f8acd060fd1bc661e5e4f414fef6761388cabf9cfadc5e09';

      const qr3 = 'a602159b45628fa29cce228bf0e445f9d8d07a12e2d0eb35df4f9087b348e033097345ef628ca8ba96d756de921a547aa5e680a0a338dfe762a4a1e9ca20d0a4bbb66c059a';
      const qr4 = 'a602159b45628fa29cce228bf0e445f9d8d07a12e2d0eb35df4f9087b348e033097345ef628ba8ba96d756de921a537aa5e680a0a338dfe762a4a1e9ca20d1a1bcb360079a';
      qr = qr4;
    } */
 
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.get<Eess[]>(`${environment.apiEessServiceUrl}` + 'qr/' + qr, { headers })
      .pipe(
        map((response: any) => {
          try {
            const result = Utils.jsendHelper(response as ApiResponse);
            if (result?.tokenjwt) {
              localStorage.setItem('anonymous_token', result?.tokenjwt);
              if (environment.verbose) { console.log('Set token anonymous'); }
            } else {
              console.log('Error se esperada un token anónimo ');
              return null;
            }
            return result?.products; // return Utils.jsendHelper(response as ApiResponse);
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
          }
        })
        /* , catchError(error => {
          return throwError(error); // From 'rxjs'
        }) */
      );
  }


  /**
  * Reserva bloquea QR
  * Retrive status
  * 
  * /frontend/{ideess}/reserve
  */
  reservar(deviceid: string | null, ideess: string | null): Observable<ApiResponse> {

    if (!deviceid || !ideess) {
      console.log('Es necesario contar con deviceid y ideess para poder reservar');
    }
    const input: object = {
      devicetype: 'FP',
      deviceid,
    };

    return this.httpClient.post<ApiResponse>(`${environment.apiEessReserveUrl}` + 'frontend/' + ideess + '/reserve', input)
      .pipe(
        map((response: any) => {
          try {
            return response;
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
          }
        })
        , catchError(error => {
          return throwError(error);
        })
      );
  }


}
