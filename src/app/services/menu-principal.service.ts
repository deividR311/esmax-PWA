import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuPrincipalService {
  public botonAtras?: EventEmitter<any>;
  public botonHamburguesa?: EventEmitter<any>;
  public mostrandoBotonAtras?: boolean = true;
  public mostrandoBotonHamburguesa?: boolean = true;
  constructor() {
    this.botonAtras = new EventEmitter();
    this.botonHamburguesa = new EventEmitter();
  }
  
  mostrarBotonAtras(opcion = true): void {
    this.mostrandoBotonAtras = opcion;
    this.botonAtras?.emit(opcion);
  }

  mostrarBotonHamburguesa(opcion = true): void {
    this.mostrandoBotonHamburguesa = opcion;
    this.botonHamburguesa?.emit(opcion);
  }
}
