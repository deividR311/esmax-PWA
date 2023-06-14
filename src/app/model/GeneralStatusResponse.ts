export interface GeneralStatusResponse {
    frontendid: string | null;
    statusgeneral: string | null;
    monto: number;
    propina: number;
    estadoactual: string;
    descripcionestado: string | null;
    rutapdf: string | null;
    cantidadproducto: string | null;
    montoneto: string | null;
    iva: string | null;
    montototal: number;
    diffcaja: string | null;
    vuelto: string | null;
    codigovuelto: string | null;
    montodispensado: number | null;
    mediodepago: string | null;
}

