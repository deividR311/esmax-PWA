import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../model/ApiResponse';
import Utils from '../shared/Utils';
import { User } from '../model/User';
import { Experiencia } from '../model/Experiencia';

@Injectable({
  providedIn: 'root'
})
export class EvaluaExperienciaService {

  constructor(private httpClient: HttpClient) { }

  addExperiencia(experiencia: Experiencia): Observable<string> {
    const url = `${environment.apiUser}/smxocm/survey`;
    return this.httpClient.post<User>(url, experiencia)
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
