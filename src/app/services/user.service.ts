import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../model/ApiResponse';
import Utils from '../shared/Utils';
import { SolicitudCodigoCambioCorreo } from '../model/SolicitudCodigoCambioCorreo';
import { SolicitudCambioCorreo } from '../model/SolicitudCambioCorreo';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  cambiarPassword(rut: string, password: string, newpassword: string): Observable<any> {
    const url = `${environment.apiUser}/smxocm/changepassword`;

    return this.httpClient.post<any>(url, {rut, password, newpassword})
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

  solicitarCodigoParaCambiarCorreo(solicitudCodigoCambioCorreo: SolicitudCodigoCambioCorreo | undefined): Observable<any> {
    const url = `${environment.apiUser}/resetemail/sendchallenge`;
    return this.httpClient.post<{status: string, message: string }>(url, solicitudCodigoCambioCorreo)
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

  cambiarCorreo(solicitudCambioCorreo: SolicitudCambioCorreo | undefined): Observable<any> {
    const url = `${environment.apiUser}/resetemail/setnewemail`;
    return this.httpClient.post<{status: string, message: string }>(url, solicitudCambioCorreo)
      .pipe(
        map((response: any) => {
          try {
            if (response?.message === 'Los codigos no coinciden' || response?.message === 'El codigo ha expirado') {
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
