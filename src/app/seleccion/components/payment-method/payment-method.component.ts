import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  @Input() paymentMethod : any = null;
  @Input() paymentImg : string = '';
  @Output() paymentMethodFunction: EventEmitter<any> = new EventEmitter();
  @Input() events: Observable<void>;

  paymentInfo : string = '';
  paymentIcon : string = '';
  title : string = '';
  paymentMethodId : number = null;
  paymentActive : boolean = null;
  private eventsSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.choosePaymentInfo();
    this.eventsSubscription = this.events.subscribe(() => this.paymentActiveEmitter());
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  
  choosePaymentInfo() {
    const { paymentMethodId, active } = this.paymentMethod;
    this.paymentMethodId = Number(paymentMethodId);
    this.paymentActive = active;
    
    switch (this.paymentMethodId) {
      case 1:
      this.title = 'Quiero pagar guardando mi tarjeta';
      this.paymentInfo = 'Te permitirá utilizar la información de esta tarjeta para tus siguientes pagos';
      this.paymentIcon = 'card-tick';
      break;

      case 2:
      this.title = 'Quiero pagar sin guardar mis tarjetas';
      this.paymentInfo = 'Puedes utilizar OnePay o ingresar los datos de tu tarjeta cada vez que quieras cargar combustible';
      this.paymentIcon = 'card-slash';
      break;

      case 3:
      this.title = 'Llamar a atendedor para pagar';
      this.paymentInfo = 'Llama a un atendedor para hacer tus pagos de forma manual';
      this.paymentIcon = 'profile';
      break;

      case 4:
      this.title = 'Quiero pagar con mi billetera';
      this.paymentInfo = 'Te permitirá pagar con las tarjetas guardadas en estas aplicaciones';
      this.paymentIcon = 'card-slash';
      break;
    
      default:
      this.title = '';
      this.paymentInfo = '';
      this.paymentIcon = '';
      break;
    }
  }

  paymentMethodDispatch() {
    this.paymentMethodFunction.emit('click');
  }

  paymentActiveEmitter(active = false){
    this.paymentActive = active;
  }
}
