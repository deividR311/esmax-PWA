import { Card } from './Card';
import { CashPayment } from './cashPayment';
import { EessAndProducto } from './EessAndProducto';
import { Estado } from './Estado';
import { FusionStatusResponse } from './FusionStatusResponse';
import { MedioPago } from './MedioPago';
import { ProductoEnum } from './ProductoEnum';
import { ResponseSmxocmPagar } from './ResponseSmxocmPagar';
import { ResponseSmxwpyPagar } from './ResponseSmxwpyPagar';
import { ResponseSmxchekPagar } from './ResponseSmxchekPagar';


export interface Orden {
    id: string;
    qr: string;
    estado: Estado;
    eessAndProductos: EessAndProducto[] | null;
    monto: number;
    mediopago: MedioPago | null;
    mediopagoid: string | null;
    propina: number;

    productosDisponibles: Array<ProductoEnum> | null;
    eessName: string | null;
    eessId: string | null;

    productoSeleccionado: EessAndProducto | null;
    card: Card | null;

    pagoResponseOcm: ResponseSmxocmPagar | null;
    pagoResponseWpy: ResponseSmxwpyPagar | null; // 17/8
    pagoResponseCash: CashPayment | null;
    pagoResponseChek: ResponseSmxchekPagar | null;
    cardType: string | null; // 17/8

    fusionStatusResponse: FusionStatusResponse | null;

    fpdeviceid: string | null;

    stepper: number;
    discount: number | null;
    maxAmount: number | null;
    offerList : any | null;
    offerValidate : any | null;
    discountAlliance : any | null;
    offer : any | null;
    discountName : string | null;
    offerMyClub : any | null;
    idBBR: any | null;
    clientRut : string | null;
}
