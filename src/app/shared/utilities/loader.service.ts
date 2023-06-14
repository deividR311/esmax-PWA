import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loader = new EventEmitter<any>();
  background = new EventEmitter<any>();

  constructor() { }

  async presentLoading( message : boolean = false ) {
    this.loader.emit({loader : true, message : message});
  }

  async closeLoading() {
    this.loader.emit({loader : false, message : false});
  }

  async showBackground() {
    this.background.emit(true);
  }

  async hideBackground() {
    this.background.emit(false);
  }
}