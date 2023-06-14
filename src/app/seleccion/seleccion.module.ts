import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeleccionComponent } from './seleccion/seleccion.component';
import { MaterialModule } from '../material.module';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { DialogselectComponent } from './dialogselect/dialogselect.component';
// import { RatingModule } from 'ng-starrating';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogEnviarBoletaCorreoComponent } from './dialog-enviar-boleta-correo/dialog-enviar-boleta-correo.component';
import { DialogOtroMontoComponent } from './dialog-otro-monto/dialog-otro-monto.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HelpButtonComponent } from './components/help-button/help-button.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { NamePromotionPipe } from '../shared/pipes/namePromotionPipe';
import { DialogEnviarVueltoComponent } from './dialog-enviar-vuelto/dialog-enviar-vuelto.component';

@NgModule({
  declarations: [SeleccionComponent, DialogselectComponent, DialogEnviarBoletaCorreoComponent, DialogOtroMontoComponent, HelpButtonComponent, PaymentMethodComponent,
    NamePromotionPipe,
    DialogEnviarVueltoComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    // RatingModule,
    // MatDialog
    MatListModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class SeleccionModule { }
