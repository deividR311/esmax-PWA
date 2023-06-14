export enum FusionState {

    /*
    INICIADA: Se inicia el proceso de compra
    PAGANDO: Pagando...
    PAGADO: Pagado
    ERRTBKPAGO: No se recibio respuesta del medio de pago
    WAITNOZZLE: Esperando surtidor
    DISPENSING: Dispensando combustible
    DISPENSED: Combustible dispensado
    STARTBILLING: Generando boleta
    ENDBILLING: Boleta generada
    STARTPLATINO: Informando datos de facturacion
    ENDPLATINO: Datos de facturacion informados
    OK: Compra finalizada OK
    */
    INICIADA = 'INICIADA',
    PAGANDO = 'PAGANDO',
    PAGADO = 'PAGADO',
    ERRTBKPAGO = 'ERRTBKPAGO',
    DISPENSING = 'DISPENSING',
    DISPENSED = 'DISPENSED',
    ENDBILLING = 'ENDBILLING',
    WAITNOZZLE = 'WAITNOZZLE',
    OK = 'OK',
    NOK = 'NOK',

    // temp
    STATUSFP = 'STATUSFP',
    STARTPLATINO = 'STARTPLATINO',
    TRXCLEARED = 'TRXCLEARED',
    ENDPLATINO = 'ENDPLATINO',

    TIMEOUT = 'TIMEOUT',
    ERRAUTHORISE = 'ERRAUTHORISE',
    AUTHORISE = 'AUTHORISE'
}
