import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../model/ApiResponse';
import Utils from '../shared/Utils';
import { InterceptorSkipHeader } from './interceptorHttp.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private httpClient: HttpClient) { }



  getPdfBinary(sovosPdfId: string): Observable<any> {
    /*     const frontendid = localStorage.getItem('FRONTENDID');
        const input: object = {
          frontendid
        }; */
    const encodedDocId = encodeURIComponent(sovosPdfId);
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');

    return this.httpClient.post<any>(`${environment.sovosPdfURL}` + encodedDocId, null, { headers })
      .pipe(
        map((response: any) => {
          try {
            return Utils.jsendHelper(response as ApiResponse);

          } catch (error) {
            console.log('Error en el servicio de conversión PDF: ', error);
          }
        })
      ).pipe(
        catchError(this.handleError)
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
