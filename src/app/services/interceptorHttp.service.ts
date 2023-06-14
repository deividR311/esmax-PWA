import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import { map } from 'rxjs/operators';


export const InterceptorSkipHeader = 'Skip-Interceptor';

@Injectable({
  providedIn: 'root'
})






export class InterceptorHttpService implements HttpInterceptor {

  constructor(
    private router: Router,
    private loadingService: LoadingService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true, req.url);

    let request = req;
    let headers: HttpHeaders;

    if (req.headers.has(InterceptorSkipHeader)) {
      headers = req.headers.delete(InterceptorSkipHeader);
      if (req.method === 'POST-sin-uso') {
        headers = req.headers.append('Content-Type', 'application/json');
      }
      request = req.clone({ headers });

    } else {
      let token = localStorage.getItem('access_token');
      // 29/9/2021
      if (!token) { // token anónimo
        token = localStorage.getItem('anonymous_token');
      }
      request = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          smxauthorization: `Bearer ${token}`
        }
      });
      
    }

    return next.handle(request) // GP: TODO MANEJAR ERRORES DEL SERVICIO.
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.loadingService.setLoading(false, request.url);
          const esCambioDeClave: boolean = request.url.includes('/smxocm/changepassword');
          if (err.status === 401 && !esCambioDeClave) {
            this.router.navigateByUrl('/login');
          }


          if (err.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.log(`Backend returned code ${err.status}, ` + `body: ${err.message}`);
          }

          return throwError(err);

        })
      )
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.loadingService.setLoading(false, request.url);
        }
        return evt;
      }));
/*       .pipe(
        finalize(() => this.loadingService.setLoading(false, request.url))
      ); */
  }

}
