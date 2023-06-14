export interface FusionStatusResponse {
    trxid: string | null;
    frontendid: string | null;
    estadoactual: string;
    descripcionestado: string | null;
    rutapdf: string | null;

    /* 27-5-2021
    "cantidadproducto": "2.18 LTR",
    "montoneto": 0,
    "iva": 0,
    "montotal": 0,
    "vuelto": 0,
    "diffcaja": 0,
    "codigovuelto": "string"
    */
    cantidadproducto: string | null;
    montoneto: string | null;
    iva: string | null;
    montototal: number;
    diffcaja: string | null;
    vuelto: string | null;
    codigovuelto: string | null;

    montodispensado: number | null;
}

