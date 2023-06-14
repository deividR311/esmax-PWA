import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { MatMenuModule } from '@angular/material/menu';
import { LoginModule } from './login/login.module';
import { InicioModule } from './inicio/inicio.module';
import { SeleccionModule } from './seleccion/seleccion.module';
import { SharedModule } from './shared/shared.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RegistroModule } from './registro/registro.module';
import { InterceptorHttpService } from './services/interceptorHttp.service';
import { UserModule } from './user/user.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/es-CL';
import { LOCALE_ID } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { RecuperarClaveModule } from './recuperarClave/recuperar-clave.module';
import { EvaluaExperienciaModule } from './evaluaExperiencia/evalua-experiencia.module';
import { PdfModule } from './pdf/pdf.module';
import { FinModule } from './fin/fin.module';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";

registerLocaleData(localeDe, 'es-CL');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    LoginModule,
    InicioModule,
    SeleccionModule,
    RegistroModule,
    MatMenuModule,
    UserModule,
    MatProgressSpinnerModule,
    RecuperarClaveModule,
    EvaluaExperienciaModule,
    SharedModule,
    PdfModule,
    FinModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: LOCALE_ID, useValue: 'es-CL' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' },
    { provide: HTTP_INTERCEPTORS,  useClass: InterceptorHttpService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
