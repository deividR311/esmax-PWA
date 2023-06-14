import { Injectable } from '@angular/core';
import { SolicitudCodigoCambioCorreo } from '../model/SolicitudCodigoCambioCorreo';

@Injectable({
  providedIn: 'root'
})
export class ValidarCorreoService {
  private solicitudCambioCorreo?: SolicitudCodigoCambioCorreo;
  constructor() { }

  public setSolicitudCodigoCambioCorreo(solicitudCambioCorreo: SolicitudCodigoCambioCorreo | undefined) {
    this.solicitudCambioCorreo = solicitudCambioCorreo;
  }
  public getSolicitudCodigoCambioCorreo(): SolicitudCodigoCambioCorreo | undefined{
    return this.solicitudCambioCorreo;
  }
  public limpiarCorreo(){
    this.solicitudCambioCorreo = undefined;
  }
}
