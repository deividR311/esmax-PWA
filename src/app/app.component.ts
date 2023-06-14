import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
// import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { TransbankService } from './services/transbank.service';
// import { Logo } from './../assets/logo';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SeleccionComponent } from './seleccion/seleccion/seleccion.component';
import { AuthService } from './services/auth.service';
import { LoadingService } from './services/loading.service';
import { delay } from 'rxjs/operators';
import { RegistroComponent } from './registro/registro/registro.component';
import { MatDialog } from '@angular/material/dialog';
// import { ConfirmCerrarSesionComponent } from './login/confirm-cerrar-sesion/confirm-cerrar-sesion.component';
import { RecuperarClaveComponent } from './recuperarClave/recuperar-clave/recuperar-clave.component';
import { MenuPrincipalService } from './services/menu-principal.service';
import { ConfirmComponent } from './shared/confirm/confirm.component';
import { LoaderService } from './shared/utilities/loader.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [

    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ]),

    trigger('routeAnimations', [
      state('in', style({
        height: '50px',   /* 40  tamaño logo */
        top: '0px',
      })),
      state('out', style({
        height: '90px',
        top: '70px',
      })),
      state('off', style({
        visibility: 'hidden',
      })),
      state('on', style({
        visibility: 'visible',
      })),

      transition('in => out', animate('300ms ease-in')),
      transition('out => in', animate('300ms ease-in')),

      transition('off => on', animate('500ms ease-in')),
      transition('on => off', animate('10ms ease-in'))
    ])


  ],
  // providers: [SeleccionComponent]
})

export class AppComponent implements OnInit {
  imageSource: any;
  referenceSeleccion!: SeleccionComponent;
  referenceRegistro!: RegistroComponent;
  referenceRecuperarClave!: RecuperarClaveComponent;

  // private seleccionComponent = this.injector.get(SeleccionComponent);
  // isLoggedIn$!: Observable<boolean>;
  isLoggedIn$ = this.authService.isLoggedInObservable;
  loading = false;
  mostrarEnlaceLogin = true;
  showButtonBack = true;
  showButtonBurger = true;
  estaEnInicio = false;
  loader : boolean = false;
  loaderMessage : boolean = false;
  background : boolean = false;

  onActivate(componentRef: any): void {
    if (componentRef instanceof SeleccionComponent) {
      this.referenceSeleccion = componentRef;
      return;
    }
    if (componentRef instanceof RegistroComponent) {
      this.referenceRegistro = componentRef;
      return;
    }
    if (componentRef instanceof RecuperarClaveComponent) {
      this.referenceRecuperarClave = componentRef;
      return;
    }
  }

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private location: Location,
    private authService: AuthService,
    private loadingService: LoadingService,
    private menuPrincipalService: MenuPrincipalService,
    private loaderService : LoaderService
  ) {
    this.loaderService.loader.subscribe(
      (res : any) => {
        const { loader, message } = res;
        this.loader = loader;
        this.loaderMessage = message;
       }
    )

    this.loaderService.background.subscribe(
      (res : any) => {
        this.background = res;
      }
    )
  }

  private isRoute(route: string): boolean {
    return this.router.url === route;
    // return this.router.url.includes(route);
  }
  private startWithRoute(route: string): boolean {
    return this.router.url.lastIndexOf(route, 0) === 0;
    // return this.router.url.includes(route);
  }

  showCompleteHeader(): boolean {
    return (!this.startWithRoute('/boleta'));
  }


  showBackArrow(): boolean {
    return (!this.isRoute('/') && !this.isRoute('/fin') && !this.startWithRoute('/qr'));
  }

  showRigthIcon(): boolean {
    return (!this.isRoute('/') && !this.isRoute('/fin') && !this.isRoute('/login')
      && !this.isRoute('/user') && (!this.isRoute('/seleccion') || this.authService.isLoggedIn) &&
      !this.isRoute('/registro') && !this.startWithRoute('/qr') && !this.isRoute('/user/transbank'));
  }



  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.mostrarEnlaceLogin = (e?.url === '/recuperarClave' || e?.url === '/login' || e?.url === '/evaluaExperiencia' ) ? false : true;
        this.estaEnInicio = this.startWithRoute('/qr');
      }
    });
    // this.isLoggedIn$ = this.authService.isLoggedInObservable;
    // this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64, ${Logo}`);
    this.listenToLoading();
    this.menuPrincipalService.botonAtras?.subscribe((resp: boolean) => {
      this.showButtonBack = resp;
    });
    this.menuPrincipalService.botonHamburguesa?.subscribe((resp: boolean) => {
      this.showButtonBurger = resp;
    });
  }

  prepareRoute(outlet: RouterOutlet): void {
    const animation = 'animation';
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData[animation];
  }

  isSuperMedio(): boolean {
    
    if (this.router.url === '/fin' || this.router.url === '/esperando' || this.router.url.startsWith('/boleta') ) {
      return true;
    } else {
      return false;
    }
  }


  backaction(): void {

    if (this.router.url === '/seleccion' || this.router.url === '/registro' || this.router.url === '/recuperarClave') {

      let result;

      if (this.router.url === '/seleccion' && !this.referenceSeleccion) {
        console.error('The referenceSeleccion must exits');
        return;
      }
      if (this.router.url === '/registro' && !this.referenceRegistro) {
        console.error('The referenceRegistro must exits');
        return;
      }
      if (this.router.url === '/recuperarClave' && !this.referenceRecuperarClave) {
        console.error('The recuperarClave must exits');
        return;
      }

      if (this.router.url === '/seleccion') {
        result = this.referenceSeleccion.componentSeleccionBackAction();
      }
      if (this.router.url === '/registro') {
        result = this.referenceRegistro.componentRegistroBackAction();
      }
      if (this.router.url === '/recuperarClave') {
        result = this.referenceRecuperarClave.componentRegistroBackAction();
      }

      if (result) {
        this.location.back();
      } else {
        // console.log('queda');
      }
      /*
      } else if (this.router.url === '/registro') {
        if (!this.reference) {
          console.error('The component Reference must exits');
          return;
        }

        const result = this.reference.componentBackAction();
        if (result) {
          // console.log('ultima');
          this.location.back();
        } else {
          // console.log('queda');
        } */

    } else {
      this.location.back();
    }

  }

  logoutaction(): void {
    // version de prueba para determinar si convence su diseño y con ello borrar el component ConfirmCerrarSesionComponent y reutilizar el, ConfirmComponent
    // si es aprobado borraria el ConfirmCerrarSesionComponent que ahora esta comentado

    const dialogRef = this.dialog.open(ConfirmComponent, {
      panelClass: 'dialog-confirm',
      position: { bottom: '0px' },
      autoFocus: false,
      data: {
        pregunta: '¿Seguro que quieres <br>cerrar sesión?',
        textoBotonAceptar: 'Cerrar sesión'
      }
    });

    // const dialogRef = this.dialog.open(ConfirmCerrarSesionComponent, {
    //   panelClass: 'dialog-confirm-cerrar-sesion',
    //   position: { bottom: '0px' },
    //   autoFocus: false
    // });
    dialogRef.afterClosed().subscribe((respuesta: boolean) => {
      // es true si presiona aceptar para cerrar sesion
      if (respuesta) {
        this.authService.doLogout();
        this.router.navigate(['/fin']);
      }
    });

  }


  loginaction(): void {
    this.router.navigate(['/login']);
  }


  /**
   * Listen loadingSub property in the LoadingService class.
   */
  listenToLoading(): void {
    this.loadingService.loadingSub
      .pipe(delay(0)) // Prevents ExpressionChangedAfterItHasBeenCheckedError in subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }


}
