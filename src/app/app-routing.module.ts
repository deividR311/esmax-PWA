import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluaExperienciaComponent } from './evaluaExperiencia/evalua-experiencia/evalua-experiencia.component';
import { FinComponent } from './fin/fin/fin.component';
import { InicioComponent } from './inicio/inicio/inicio.component';
import { LoginComponent } from './login/login/login.component';
import { VerComponent } from './pdf/ver/ver.component';
// import { VerComponent } from './pdf/ver/ver.component';
import { RecuperarClaveComponent } from './recuperarClave/recuperar-clave/recuperar-clave.component';
import { RegistroComponent } from './registro/registro/registro.component';
import { SeleccionComponent } from './seleccion/seleccion/seleccion.component';
import { WaitingComponent } from './shared/waiting/waiting.component';
import { CambiarCorreoComponent } from './user/cambiar-correo/cambiar-correo.component';
import { ListoComponent } from './user/listo/listo.component';
import { TransbankComponent } from './user/transbank/transbank.component';
import { UserComponent } from './user/user/user.component';
import { ValidarCorreoComponent } from './user/validar-correo/validar-correo.component';
import { CambiarClaveComponent } from './user/cambiar-clave/cambiar-clave.component';
import { HomeComponent } from './user/home/home.component';


export const routes: Routes = [
  { path: 'qr/:qr', component: InicioComponent, data: { animation: 'out' } },
  { path: 'boleta/:pdfpath', component: VerComponent, data: { animation: 'in' } },
  // -->         { path: '*/:id', component: AppComponent },
  // { path: '/:qr', component: InicioComponent },
  // { path: '', component: InicioComponent }
  // { path: '/:qr', component: InicioComponent, pathMatch: 'full' },

  { path: 'login', component: LoginComponent, data: { animation: 'in' } },
  { path: 'seleccion', component: SeleccionComponent, data: { animation: 'in' } },
  { path: 'registro', component: RegistroComponent, data: { animation: 'in' } },
  { path: 'fin', component: FinComponent, data: { animation: 'in' } },
  { path: 'user', component: UserComponent, data: { animation: 'in' } },
  { path: 'user/editarCorreo', component: CambiarCorreoComponent, data: { animation: 'in' } },
  { path: 'user/editarClave', component: CambiarClaveComponent, data: { animation: 'in' } },
  { path: 'user/validarCorreo', component: ValidarCorreoComponent, data: { animation: 'in' } },
  { path: 'user/listo', component: ListoComponent, data: { animation: 'in' } },
  { path: 'user/listoPass', component: ListoComponent, data: { animation: 'in' } },
  { path: 'user/transbank', component: TransbankComponent, data: { animation: 'in' } },
  { path: 'user/home', component: HomeComponent, data: { animation: 'in' } },
  { path: 'recuperarClave', component: RecuperarClaveComponent, data: { animation: 'in' } },
  { path: 'evaluaExperiencia', component: EvaluaExperienciaComponent, data: { animation: 'in' } },
  { path: 'esperando', component: WaitingComponent, data: { animation: 'in' }},
  { path: '**', component: InicioComponent, data: { animation: 'out' } },
];
// {path: <base-path>, component: <component>, outlet: <target_outlet_name>}
// canActivate: [AuthGuard]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
