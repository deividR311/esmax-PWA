
export interface IError {
    // id: number;
    title: string;
    msg: string;
}

export const SMX_ERROR: Record<string, IError> = {

    // Caso 2 - Sin Conexión a fusion en EDS
    2: { title: '¡Lo sentimos!', msg: 'En este momento el servicio no se encuentra disponible. Por favor inténtalo más tarde.' },

    // Caso 2-01 - No hay código QR
    201: { title: '¡Lo sentimos!', msg: 'No hay código QR.' },

    // Caso 2-02 - El servicio de QR devuelve datos que no son adecuados.
    202: { title: '¡Lo sentimos!', msg: 'Por favor intente más tarde. No tenemos datos disponibles.' },

    // Caso 2-03 - No hay acceso al servicio ¿Internet?
    203: { title: '¡Lo sentimos!', msg: 'Por favor intente más tarde. No hay acceso a los datos. Revise el acceso a internet.' },

        // Caso 3 y 7 - Surtidor no disponible al scannear QR
        3: { title: 'Surtidor no disponible', msg: 'Te invitamos a cargar en otro surtidor de la estación.' },

    // Caso 4 - Falla en envío de SMS [En registro]
    4: { title: 'Error en envío de SMS', msg: 'Ha ocurrido un error en el envío del código de confirmación por SMS. Por favor vuelve a intentar.' },

    // Caso 6 - Fallo envío Email [En registro]
    6: { title: 'Error en envío de correo electrónico', msg: 'Ha ocurrido un error en el envío del código de confirmación por correo electrónico. Por favor vuelve a intentar.' },

        // Caso 8 - TBK Oneclick / no responde
        8: { title: 'Error de pago', msg: 'Ha ocurrido un error al procesar tu pago. Por favor selecciona otro medio de pago.' },

    // Caso 9 - Oneclick / WebpayNo responde
    9: { title: 'Pago Rechazado', msg: 'Tu pago ha sido rechazado. Para terminar tu compra por favor selecciona otro medio de pago.' },

    // Caso 11 - Oneclick inscripción error [Extra 20-9-2021]
    11: { title: 'Inscripción rechazada', msg: 'Por favor selecciona otro medio de pago.' },

    // Caso 12 - Excede tiempo máximo pago WebPay
    12: { title: '¡Lo sentimos!', msg: 'Se terminó el tiempo para realizar tu pago. Por favor vuelve a intentar o selecciona otro medio de pago.' },

    // Caso 24 - Autorizador rechaza Webpay: (Excede monto, Tarjeta Vencida, Tarjeta Bloqueada, Clave Incorrecta)
    24: { title: 'Pago Rechazado', msg: 'Tu pago ha sido rechazado. Para terminar tu compra por favor selecciona otro medio de pago.' },

        // Caso 30 y 31 - Pago Anulado Onepay / Webpay
    30: { title: 'Pago Anulado', msg: 'Ocurrió un problema y no es posible realizar la carga de combustible. Por favor vuelve a intentarlo.' },

        // Caso 33 - No hay comunicación con Sovos
        33: { title: '¡Lo sentimos!', msg: 'Ocurrió un problema y no logramos generar tu boleta.' },

        // Caso 34 - No hay comunicación con servicio E-Mail
        34: { title: '¡Lo sentimos!', msg: 'Ocurrió un problema y no logramos enviar tu boleta, te invitamos a descargarla desde el resumen de compra.' },

    // Timeout
    100: { title: '¡Lo sentimos!', msg: 'Se acabó el tiempo disponible, te invitamos a volver a intentarlo.' },
    101: { title: '¡Lo sentimos!', msg: 'No es posible reservar, te invitamos a volver a intentarlo con otro surtidor.' },
    102: { title: '¡Lo sentimos!', msg: 'Se acabo el tiempo de comunicación con el medio de pago, te invitamos a volver a intentarlo.' },
    103: { title: 'No es posible coninuar', msg: 'No existe es status general de su operación. Debe volver a comenzar.' } // status general error
};



/*
    Caso 2 - Sin Conexión a fusion en EDS
    ¡Lo sentimos!
En este momento el servicio no se encuentra disponible. Por favor inténtalo más tarde.

    Caso 3 y 7 - Surtidor no disponible al scannear QR
    Surtidor no disponible
Te invitamos a cargar en otro surtidor de la estación.

    Caso 4 - Falla en envío de SMS
    Error en envío de SMS
Ha ocurrido un error en el envío del código de confirmación por SMS.Por favor vuelve a intentar.

    Caso 6 - Fallo envíoE-mail
    Error en envío de correo electrónico
Ha ocurrido un error en el envío del código de confirmación por correo electrónico.Por favor vuelve a intentar.

    Caso 8 - TBK Oneclickno responde
    Error de pago
Ha ocurrido un error al procesar tu pago.Por favor selecciona otro medio de pago.

    Caso 9 - Oneclick / WebpayNo responde
    Pago Rechazado
Tu pago ha sido rechazado.Para terminar tu compra por favor selecciona otro medio de pago.

    Caso 12 - Excede tiempomáximo
    ¡Lo sentimos!
Se terminó el tiempo para realizar tu pago.Por favor vuelve a intentar o selecciona otro medio de pago.

    Caso 30 y 31 - Pago Anulado Onepay / Webpay
    Pago Anulado
Ocurrió un problema y no es posible realizar la carga de combustible.Por favor vuelve a intentarlo.

    Caso 33 - No hay comunicacióncon Sovos
    ¡Lo sentimos!
Ocurió un problema y no logramos generar tu boleta.

    Caso 34 - No hay comunicacióncon servicio E-Mail
    ¡Lo sentimos!
  urrió un problema y no logramos enviar tu boleta, te invitamos a descargarla desde el resumen de compra.

   Venta en 0 Crédito y Débito

*/

