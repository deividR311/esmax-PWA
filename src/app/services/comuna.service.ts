import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comuna } from '../model/Comuna';
import { InterceptorSkipHeader } from './interceptorHttp.service';

@Injectable({
  providedIn: 'root'
})
export class ComunaService {


  apigob = 'https://apis.digital.gob.cl/dpa/comunas';

  constructor(private httpClient: HttpClient) { }


  getComunas(): Observable<Comuna[]> {
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.get<Comuna[]>(this.apigob, {headers});
  }

}
