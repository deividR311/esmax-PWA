import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../model/ApiResponse';
import Utils from '../shared/Utils';
// import { InterceptorSkipHeader } from './interceptorHttp.service';
import { User } from '../model/User';
import { ResponseChalenge } from '../model/ResponseChalenge';
import { InterceptorSkipHeader } from './interceptorHttp.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private httpClient: HttpClient) { }

  getEmailChallenge(email: string): Observable<ResponseChalenge> {
    const expiresin = `${environment.chalengeExpiresin}`;
    // const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post<ResponseChalenge>(`${environment.apiUser}` + '/smxocm/validarcorreo', { email, expiresin }/* , { headers } */)
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


  getFonoChallenge(telefono: string): Observable<ResponseChalenge> {
    const expiresin = `${environment.chalengeExpiresin}`;
    // const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post<ResponseChalenge>(`${environment.apiUser}` + '/smxocm/validartelefono',
                   { telefono, expiresin }/* , { headers } */)
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


  creaUsuario(user: User): Observable<any> {
    // console.log('creaUsuario stringify: ', JSON.stringify(user) );
    const input: object = {
      rut: user.rut,
      tipousuario: 'PERSONA',
      password: user.password,
      telefono: user.telefono,
      telefonovalidado: user.telefonovalidado,
      email: user.email,
      emailvalidado: user.emailvalidado,
      comuna: user.comuna,
      nombres: user.nombres,
      apellidos: user.apellidos,
      genero: user.genero,
      fechanacimiento: user.fechanacimiento,
    };
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post<User>(`${environment.apiUser}` + '/smxocm/crearusuario', input , { headers } )
      .pipe(
        map((response: any) => {
          try {
            // return Utils.jsendHelper(response as ApiResponse);
            return response;
          } catch (error) {
            console.log('Error se esperada ApiResponse: ', error);
          }
        })
      );
  }



  updateUsuario(user: any): Observable<any> {
    // console.log('creaUsuario stringify: ', JSON.stringify(user) );
    const input: object = {
      rut: user.rut,
      // tipousuario: 'PERSONA',
      // password: user.password,
      telefono: user.telefono,
      telefonovalidado: user.telefonovalidado,
      // email: user.email,
      // emailvalidado: user.emailvalidado,
      comuna: user.comuna,
      nombres: user.nombres,
      apellidos: user.apellidos,
      genero: user.genero,
      fechanacimiento: user.fechanacimiento,
    };

    // const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post<User>(`${environment.apiUser}` + '/smxocm/updateuserinfo', input) // , { headers })
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


}
