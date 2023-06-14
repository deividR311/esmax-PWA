import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { NotificationInfo } from '../model/notificationInfo';
import { NotificationRecord } from '../model/notificationRecord';

@Injectable({
  providedIn: 'root'
})
export class NotificationRecordService {

  constructor(private httpClient: HttpClient) { }

  create( data : NotificationRecord, info : NotificationInfo ) {
    let response = { data, info }
    return this.httpClient.post(`${environment.notification}/notificationRecord/create`, response);
  }

  createConfirmation( info : NotificationInfo, notificationRecordId : number ) {
    let response = { info, notificationRecordId }
    return this.httpClient.post(`${environment.notification}/notificationRecord/createConfirmation`, response);
  }

  update( data : NotificationRecord, id : number ) {
    return this.httpClient.put(`${environment.notification}/notificationRecord/update/${id}`, data);
  }

  get( id : number ) {
    return this.httpClient.get(`${environment.notification}/notificationRecord/get/${id}`);
  }

  getAll() {
    return this.httpClient.get(`${environment.notification}/notificationRecord/getAll`);
  }

  getNotifications() {
    return this.httpClient.get(`${environment.notification}/notification/getAll`);
  }
}
