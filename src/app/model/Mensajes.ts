export interface IDescripcionMensaje {
    contenido: string;
    clase: string;
    icono: string;
    x: boolean;
}
export interface Mensaje {
    SE_INSCRIBIO_NUEVA_TARJETA: IDescripcionMensaje;
    SE_RECHAZO_INSCRIPCION_TARJETA: IDescripcionMensaje;
    SE_ENVIO_CODIGO_A_CORREO: IDescripcionMensaje;
    EL_CODIGO_INGRESADO_NO_COINCIDE: IDescripcionMensaje;
    EL_CODIGO_INGRESADO_EXPIRADO: IDescripcionMensaje;
    SE_ACTUALIZO_TU_USUARIO: IDescripcionMensaje;
    TARJETA_ELIMINADA: IDescripcionMensaje;
}
const tipoMensaje = {
    info : {clase: 'snackbar-message-info', icono: '../../../assets/info.svg'},
    warn : {clase: 'snackbar-message-warning', icono: '../../../assets/error.svg'},
}
export const MENSAJES: Mensaje = {
    SE_INSCRIBIO_NUEVA_TARJETA: { contenido: 'Se inscribió una nueva tarjeta', ...tipoMensaje.info , x: true },
    SE_RECHAZO_INSCRIPCION_TARJETA: {
        contenido: 'Inscripción rechazada <br> Por favor selecciona otro medio de pago.', ...tipoMensaje.warn, x: false},
    SE_ENVIO_CODIGO_A_CORREO: { contenido: 'Se ha enviado un código de verificación a su correo.', ...tipoMensaje.info , x: true },
    EL_CODIGO_INGRESADO_NO_COINCIDE: {contenido: 'El código ingresado no coincide, intente nuevamente.', ...tipoMensaje.warn, x: true},
    EL_CODIGO_INGRESADO_EXPIRADO: {
        contenido: 'El código ingresado ha caducado, intente reenviando un nuevo código.', ...tipoMensaje.warn, x: true},
    SE_ACTUALIZO_TU_USUARIO: { contenido: 'Se actualizó tu usuario', ...tipoMensaje.info, x: true },
    TARJETA_ELIMINADA: { contenido: 'Tarjeta eliminada', ...tipoMensaje.info, x: true },
};
