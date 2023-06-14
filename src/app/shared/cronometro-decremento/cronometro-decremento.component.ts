import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-cronometro-decremento',
  templateUrl: './cronometro-decremento.component.html',
  styleUrls: ['./cronometro-decremento.component.css']
})
export class CronometroDecrementoComponent implements OnChanges, OnInit {

  public time = 0;
  public display: any;
  public interval: any;
  @Input() public iniciar:boolean = false;
  @Output() finCronometro = new EventEmitter<boolean>();

  constructor() { }
  ngOnInit() {
  }
  ngOnChanges(): void {
    if (this.iniciar) {
      this.startTimer();
    }
  }
  startTimer(): void {
    this.time = (environment.chalengeExpiresin) * 60;

    const interval = setInterval(() => {
      this.time--;

      if (this.time < 0) {
        clearInterval(interval);
        this.finCronometro.emit(true);
        this.display = '--';
      } else {
        this.display = this.transform(this.time);
      }

    }, 1000);
  }
  transform(value: number): string {
    if (value === 0) {
      this.pauseTimer();
      this.finCronometro.emit(true);
      return '--';
    }
    const minutes: number = Math.floor(value / 60);
    let segundos: string = `${value - minutes * 60}`;
    segundos = (segundos.length === 1) ? `0${segundos}` : segundos;
    return minutes + ':' + segundos;
  }
  pauseTimer(): void {
    clearInterval(this.interval);
  }
}
