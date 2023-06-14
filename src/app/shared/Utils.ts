import { ApiResponse } from '../model/ApiResponse';
import jwt_decode from 'jwt-decode';
import { Card } from '../model/Card';
import { User } from '../model/User';

export default class Utils {



    static stringToDate(input: string): Date | null {
        if (!input) {
            return null;
        }
        // formato: 19710302 AAAAMMDD
        // '1968-11-16T00:00:00'
        const a = input.substring(0, 4);
        const m = input.substring(4, 6);
        const d = input.substring(6, 8);
        return new Date(a + '-' + m + '-' + d + 'T00:00:00');
    }

    static jsendHelper(apiResponse: ApiResponse): any {
        if (apiResponse?.status === 'success') {
            return apiResponse.data;
        } else {
            if (apiResponse) {
                console.log(apiResponse?.status, apiResponse?.message);
                if (apiResponse?.status === 'error') {
                    // return apiResponse;
                    return null;
                }
            } else {
                console.error('Error indeterminado en el servicio.');
            }
            return null;
        }
    }


    static gerenateUUID(): string {
        const hex = [...Array(256).keys()]
            .map(index => (index).toString(16).padStart(2, '0'));

        const r = crypto.getRandomValues(new Uint8Array(16));

        // tslint:disable-next-line:no-bitwise
        r[6] = (r[6] & 0x0f) | 0x40;
        // tslint:disable-next-line:no-bitwise
        r[8] = (r[8] & 0x3f) | 0x80;

        return [...r.entries()]
            .map(([index, int]) => [4, 6, 8, 10].includes(index) ? `-${hex[int]}` : hex[int])
            .join('');
    }


    static jwtToUserToStorage(jwt: any): User | undefined {
        // const envoltorio = Utils.jsendHelper(jwt as ApiResponse);
        const token = jwt;
        const decode = jwt_decode(token);
        const user = decode as any;
        if (user?.rut && user?.rut !== '') {
            localStorage.setItem('access_token', token);
            return user;
        } else {
            console.error('Decoded JWR not have rut for user !' + user.nombres);
            return undefined;
        }
    }

    static currentUserFromStorage(): User | null {
        // const envoltorio = Utils.jsendHelper(jwt as ApiResponse);
        const token = localStorage.getItem('access_token');
        if (token) {
            const decode = jwt_decode(token + '');
            const user = decode as User;
            if (user?.rut && user?.rut !== '') {
                return user;
            } else {
                console.error('Decoded JWR is not correct !' + user.nombres);
                return null;
            }
        } else {
            return null;
        }
    }

    static tokenExpired(token: any): boolean {
        const decode = jwt_decode(token) as any;
        if (decode.exp === undefined) {
            // return false; TOOOODDDDDOO TODO
            return true;
        }
        const expiry = decode.exp; // (JSON.parse(atob(token.split('.')[1]))).exp;
        const tokenExpired = Date.now() > (decode.exp * 1000);
        if (tokenExpired) { return true; } // TOOOODDDDDOO TODO
        return true;
        // return (Math.floor((new Date()).getTime() / 1000)) >= expiry;
    }


    static cleanRut(rut: string): string {
        return typeof rut === 'string'
            ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase() : '';
    }


    static getCheckDigit(input: string): string {
        const rut = Array.from(this.cleanRut(input), Number);

        if (rut.length === 0 || rut.includes(NaN)) {
            // throw new Error(`"${input}" as RUT is invalid`);
            console.log(`"${input}" as RUT is invalid`);
            return '-';
        }

        const modulus = 11;
        const initialValue = 0;
        const sumResult = rut
            .reverse()
            .reduce(
                (accumulator, currentValue, index) =>
                    accumulator + currentValue * ((index % 6) + 2),
                initialValue
            );

        const checkDigit = modulus - (sumResult % modulus);

        if (checkDigit === 10) {
            return 'K';
        } else if (checkDigit === 11) {
            return '0';
        } else {
            return checkDigit.toString();
        }
    }

    /**
     * Gets fav card
     * @param cards tarjetas de un usuario.
     * @returns fav card [siempre trata de retonar una card]
     */
    static getFavCard(cards: Card[]): Card | null {
        if (!cards || cards.length === 0) {
            return null;
        }
        let result = cards[0];

        for (const card of cards) {
            if (card.status?.toLocaleUpperCase() === 'OKDEFAULT') {
                result = card;
                break;
            }
        }

        return result;

    }

    /**
    * Gets Browser
    * @returns browser detected
    */
    static myBrowser(): string {

        if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
            return 'Opera';
        } else if (navigator.userAgent.indexOf("Chrome") != -1) {
            return 'Chrome';
        } else if (navigator.userAgent.indexOf("Safari") != -1) {
            return 'Safari';
        } else if (navigator.userAgent.indexOf("Firefox") != -1) {
            return 'Firefox';
        } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.DOCUMENT_NODE == true)) {
            return 'IE';

        } else {
            return 'unknown';
        }

    }

    /**
        * Remove localStorage 
        * @returns void
        */
    static removePartialLocalStorage(cartName: string): void {
        // remove local storage ########################
        localStorage.removeItem('anonymous_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem(cartName);
        // localStorage.removeItem('TRXID');
        localStorage.removeItem('FRONTENDID');
        localStorage.removeItem('TBK_TOKEN');
        localStorage.removeItem('ttl');
        // remove local storage ########################
    }

}
