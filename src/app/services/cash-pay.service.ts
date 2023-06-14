import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CashPayment } from '../model/cashPayment';

@Injectable({
  providedIn: 'root'
})

export class CashPayService {

  constructor(private httpClient: HttpClient) { }

  create( data : CashPayment ) {
    return this.httpClient.post(`${environment.apiEessReserveUrl}smxcashpay/create`, data);
  }

  update( data : CashPayment, id : number ) {
    return this.httpClient.put(`${environment.apiEessReserveUrl}smxcashpay/update/${id}`, data);
  }

  get( id : number ) {
    return this.httpClient.get(`${environment.apiEessReserveUrl}smxcashpay/get/${id}`);
  }

  getAll() {
    return this.httpClient.get(`${environment.apiEessReserveUrl}smxcashpay/getAll`);
  }

  finish( data : any ) {
    return this.httpClient.post(`${environment.apiEessReserveUrl}smxcashpay/finishpayment`, data);
  }

  getNotificationCashPaymentFirebase(data : any ) {
    return this.httpClient.post(`${environment.apiEessReserveUrl}smxcashpay/getNotificationCashPaymentFirebase`, data);
  }
}
