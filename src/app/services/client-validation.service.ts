import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { InterceptorSkipHeader } from './interceptorHttp.service';

@Injectable({
  providedIn: 'root'
})

export class ClientValidationService {

  constructor(private httpClient: HttpClient) { }

  getOffers( data : any ) {
    return this.httpClient.post(`${environment.apiEessReserveUrl}smxclientvalidator/offers`, data);
  }

  offerConfirm( data : any ) {
    return this.httpClient.put(`${environment.apiEessReserveUrl}smxclientvalidator/confirm`, data);
  }
}
