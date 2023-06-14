/* "productno": 1,
   "productname": "93",
   "modeno": 1,

   "modename": "fuelm01",
   "productum": "Liters",
   "umshort": "LTR",
   "price": 687,
   "iddsps": "1",
   "dspdeviceid": 1,
   "idfps": "1",
   "fpdeviceid": 1,
   "pumpno": 1,
   "nozzleno": 1,
   "logicalid": null */

import { ProductoEnum } from './ProductoEnum';

export interface Producto {
    productno: number;
    productname: string;
    modeno: number;

    modename: string;
    productum: string;
    umshort: string;

    price: number;
    iddsps: string;
    dspdeviceid: number;

    idfps: string;
    fpdeviceid: number;
    pumpno: number;
    nozzleno: number;
    logicalid: any | null ;

    productEnum: ProductoEnum | null;
}
