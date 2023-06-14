import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../model/ApiResponse';
import Utils from '../shared/Utils';
// import { InterceptorSkipHeader } from './interceptorHttp.service';
import { User } from '../model/User';
import { SolicitudCodigoUsuario } from '../model/SolicitudCodigoUsuario';
import { SolicitudCambioClave } from '../model/SolicitudCambioClave';

@Injectable({
  providedIn: 'root'
})
export class RecuperarClaveService {

  constructor(private httpClient: HttpClient) { }

  getUsuario(rut: string): Observable<any | User> {
    const url = `${environment.apiUser}/reset/getuserinfo`;
    // const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post<User>(url, {rut}/* , { headers } */)
      .pipe(
        map((response: any) => {
          try {
            return Utils.jsendHelper(response as ApiResponse);
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
          }
        })
      );
  }

  enviarCodigoRestaurarClave(solicitudCodigoUsuario: SolicitudCodigoUsuario): Observable<any> {
    const url = `${environment.apiUser}/reset/sendchallenge`;
    // const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post<User>(url, solicitudCodigoUsuario/* , { headers } */)
      .pipe(
        map((response: any) => {
          try {
            return Utils.jsendHelper(response as ApiResponse);
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
          }
        })
      );
  }

  restaurarClave(solicitudCambioClave: SolicitudCambioClave): Observable<any > {
    const url = `${environment.apiUser}/reset/setnewpassword`;
    // const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post<User>(url, solicitudCambioClave, /* , { headers } */)
      .pipe(
        map((response: any) => {
          try {
            if (response?.message === 'El codigo ha expirado') {
              return response?.message;
            } else {
              return Utils.jsendHelper(response as ApiResponse);
            }
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
          }
        })
      );
  }
}
