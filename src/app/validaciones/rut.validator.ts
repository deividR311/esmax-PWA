import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function RutValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let isValid = true;
        if (control.value) {
            isValid = rutValidator.validar(control.value);
        }
        return isValid ? null : { rutValidator: 'Rut no válido.' };
    };
}
const rutValidator = {
    quitarFormato: (rut: string | any) => {
        let strRut = String(rut);
        while (strRut.indexOf('.') !== -1) {
            strRut = strRut.replace('.', '');
        }
        while (strRut.indexOf('-') !== -1) {
            strRut = strRut.replace('-', '');
        }

        return strRut;
    },
    digitoValido: (dv: string) => {
        if (dv !== '0' && dv !== '1' && dv !== '2' && dv !== '3' && dv !== '4'
            && dv !== '5' && dv !== '6' && dv !== '7' && dv !== '8' && dv !== '9'
            && dv !== 'k' && dv !== 'K') {
            return false;
        }
        return true;
    },
    digitoCorrecto: (crut: string | any) => {
        let rut;
        const largo = crut.length;
        if (largo < 2) {
            return false;
        }
        if (largo > 2) {
            rut = crut.substring(0, largo - 1);
        } else {
            rut = crut.charAt(0);
        }
        const dv: string = crut.charAt(largo - 1).toLowerCase();

        rutValidator.digitoValido(dv);
        if (rut == null || dv == null) {
            return 0;
        }

        const dvr: string = rutValidator.getDigito(rut).toString();
        const normDv = (dv.toLowerCase() === 'k' || dv === '0') ? 'k' : dv;

        return dvr === normDv || (dvr === '0' && normDv === 'k');
    },
    getDigito: (rut: string | any) => {
        let suma = 0;
        let mul = 2;
        for (let i = rut.length - 1; i >= 0; i--) {
            suma = suma + rut.charAt(i) * mul;
            if (mul === 7) {
                mul = 2;
            } else {
                mul++;
            }
        }
        const res = suma % 11;
        if (res === 1) {
            return 'k';
        } else {
            const val =  11 - res;
            if (val === 11) {
                return '0';
            }
            return val + '' ;

        }
    },
    validar: (texto: string): boolean => {
        /*
        if (texto.indexOf('-') !== texto.length - 2) {
            return false;
        }
        */
        texto = rutValidator.quitarFormato(texto);
        console.log(texto);
        if (texto == "666666666"){
            return false;
        }

        const largo = texto.length;

        // rut muy corto
        if (largo < 2) {
            return false;
        }
        // verifica que los numeros correspondan a los de rut
        for (let i = 0; i < largo; i++) {
            // numero o letra que no corresponda a los del rut
            if (!rutValidator.digitoValido(texto.charAt(i))) {
                return false;
            }
        }
        let invertido = '';
        for (let i = (largo - 1), j = 0; i >= 0; i-- , j++) {
            invertido = invertido + texto.charAt(i);
        }
        let dtexto = '';
        dtexto = dtexto + invertido.charAt(0);
        dtexto = dtexto + '-';
        let cnt = 0;

        for (let i = 1, j = 2; i < largo; i++ , j++) {
            if (cnt === 3) {
                dtexto = dtexto + '.';
                j++;
                dtexto = dtexto + invertido.charAt(i);
                cnt = 1;
            } else {
                dtexto = dtexto + invertido.charAt(i);
                cnt++;
            }
        }

        invertido = '';
        for (let i = (dtexto.length - 1), j = 0; i >= 0; i-- , j++) {
            invertido = invertido + dtexto.charAt(i);
        }

        if (rutValidator.digitoCorrecto(texto)) {
            return true;
        }
        return false;
    }
};
