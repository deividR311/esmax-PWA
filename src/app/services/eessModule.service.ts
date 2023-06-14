import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})

export class EessModuleService {

  constructor(private httpClient: HttpClient) { }

  getPaymentMethodsByEess( eess : string = '' ) {
    return this.httpClient.get(`${environment.apiEessReserveUrl}smxeessmodule/getAllByEess/${eess}`);
  }
}