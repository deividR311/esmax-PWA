import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { environment } from '@env/environment';
import { Orden } from '../model/Orden';
import { ApiResponse } from '../model/ApiResponse';
import jwt_decode from 'jwt-decode';
import Utils from '../shared/Utils';


@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private loggedIn$ = new BehaviorSubject<boolean>(false); // {1}

    headers = new HttpHeaders().set('Content-Type', 'application/json');
    currentUser: User | undefined;

    constructor(
        private http: HttpClient,
        public router: Router
    ) {
    }



    loginNoQr(usuario: string, clave: string): Observable<User> {

        const input: object = {
            rut: usuario,
            password: clave,
        };

        const api = `${environment.apiUser}/noqr/login`;
        return this.http.post<any>(api, input).pipe(    
            map((response: any) => {
                try {
                    const envoltorio = Utils.jsendHelper(response as ApiResponse);
                    const token = envoltorio?.tokenjwt;
                    const decode = jwt_decode(token);
                    const user = decode as any;

                    if (user?.rut && user?.rut !== '') {
                        this.loggedIn$.next(true);
                        this.currentUser = user;
                        localStorage.setItem('access_token', token);
                    } else {
                        this.loggedIn$.next(false);
                        console.error('Decoded JWR not have rut for user !' + user);
                    }
                    return user;

                } catch (error) {
                    console.log('Error se esperada ApiResponse: ', error);
                    this.loggedIn$.next(false);
                }
            })
        );
    }


    // ------- ----------------------------------------------------------------------
    // Sign-in ----------------------------------------------------------------------
    // ------- ----------------------------------------------------------------------
    signInWithOrder(usuario: string, clave: string, orden: Orden): Observable<User> {
        let ideess;
        let dspdeviceid;
        let fpdeviceid;

        if (orden.eessAndProductos) {
            ideess = orden.eessId;

            if (orden.eessAndProductos[0]?.dspdeviceid && orden.eessAndProductos[0]?.fpdeviceid) {
                dspdeviceid = orden.eessAndProductos[0].dspdeviceid;
                fpdeviceid = orden.eessAndProductos[0].fpdeviceid;
            }
        }

        const input: object = {
            ideess,
            dspdeviceid,
            fpdeviceid,
            rut: usuario,
            password: clave,
        };

        const api = `${environment.apiUser}/login`;
        return this.http.post<any>(api, input).pipe(    
            map((response: any) => {  // NOTE: response is of type SomeType -- return the modified data:
                try {
                    const envoltorio = Utils.jsendHelper(response as ApiResponse);
                    const token = envoltorio?.tokenjwt;
                    const decode = jwt_decode(token);
                    const user = decode as any;

                    if (user?.rut && user?.rut !== '') {
                        this.loggedIn$.next(true);
                        this.currentUser = user;
                        localStorage.setItem('access_token', token);
                    } else {
                        this.loggedIn$.next(false);
                        console.error('Decoded JWR not have rut for user !' + user);
                    }
                    return user;

                } catch (error) {
                    console.log('Error se esperada ApiResponse: ', error);
                    this.loggedIn$.next(false);
                }
            })
            /* , catchError(error => {
            return throwError(error); // From 'rxjs'
            }) */
        );









    }


    get isLoggedInObservable(): Observable<boolean> {
        return this.loggedIn$.asObservable(); // {2}
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    /*
    get isLoggedIn_oldWay(): boolean {
        const authToken = localStorage.getItem('access_token');
        return (authToken !== null) ? true : false;
    } */

    get isLoggedIn(): boolean{
        // console.log(' isLoggedIn  -<>');
        const authToken = localStorage.getItem('access_token');
        if (authToken) {
            // vallidation
            if (!Utils.tokenExpired(authToken)) {
                localStorage.removeItem('access_token');
                this.loggedIn$.next(false);
                return false;
            } else {
                const userdata = Utils.jwtToUserToStorage(authToken);
                if (userdata) {
                    this.currentUser = userdata;
                    this.loggedIn$.next(true);
                    return true;
                } else {
                    this.loggedIn$.next(false);
                    return false;
                }
            }
        } else {
            this.loggedIn$.next(false);
            return false;
        }
    }


    doLogout(stayhere?: boolean): void {
        const removeToken = localStorage.removeItem('access_token');
        localStorage.removeItem('anonymous_token');
        this.loggedIn$.next(false);
        if (removeToken == null) {
            if (!stayhere) {
                this.router.navigate(['/fin']);
            }
        }
    }

    /**
     * Gets user profile
     * @param id of User
     * @returns user profile
     * @deprecated
     */
    getUserProfile(id: string): Observable<any> {
        const api = `${environment.apiUser}/user-profile/${id}`;
        return this.http.get(api, { headers: this.headers }).pipe(
            map((res: any) => {
                return res || {};
            }),
            // catchError(this.handleError)
        );
    }






}
