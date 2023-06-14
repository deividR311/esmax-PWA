import { Directive, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRut]'
})
export class RutDirective implements AfterViewInit {

  constructor(public ref: ElementRef, private ngControl: NgControl ) { }
  @HostListener('input', ['$event']) onInput($event: { target: HTMLInputElement, preventDefault: any } ): any {
    this.formatearRut($event);
  }
  formatearRut($event: any): string | any {
    let rut = $event.target.value.toUpperCase().trim();
    rut = rut.split('-').join('');
    rut = rut.replace(/[^0-9kK]/g, '').slice(0, 9);
    if (rut.length > 1 ) {
        const fin = rut.substr(rut.length - 1);
        let inicio: any = rut.substr(0, rut.length - 1);
        inicio = inicio.split('.').join('');
        if (inicio.length > 3) {
            const arr: string[] = inicio.split('');
            arr.reverse();
            inicio = arr.reverse().join('');
        }
        if ( !isNaN(inicio) ) {
          inicio = new Intl.NumberFormat('de-DE').format(inicio);
        }
        this.ngControl.control?.setValue(inicio.split('.').join('') + '' + fin);
        this.ref.nativeElement.value = inicio + '-' + fin;
        $event.preventDefault();
    } else {
      this.ref.nativeElement.value = rut;
    }
  }
  ngAfterViewInit(): void {
    const event  =  { target: {value: this.ngControl.control?.value}, preventDefault: ( ) => {} };
    this.formatearRut(event);
  }
}
