import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { AuthService } from 'src/app/services/auth.service';
import { MenuPrincipalService } from '../../services/menu-principal.service';

@Component({
  selector: 'app-listo',
  templateUrl: './listo.component.html',
  styleUrls: ['./listo.component.css']
})
export class ListoComponent implements OnInit, OnDestroy {
  public origen = '';
  public mensajeMostrar = '';
  isRemote: boolean = false;
  constructor(private router: Router, private menuPrincipalService: MenuPrincipalService, private authService: AuthService,) {
    this.menuPrincipalService.mostrarBotonHamburguesa(false);
    this.menuPrincipalService.mostrarBotonAtras(false);
  }

  ngOnInit(): void {
    if (this.isRoute('/user/listo')) {
      this.origen =  'listo';
      this.mensajeMostrar = 'Tu correo se ha modificado con éxito';
    }
    if (this.isRoute('/user/listoPass')) {
      this.origen  = 'listoPass';
      this.mensajeMostrar = 'Tu contraseña ha sido modificada con éxito';
    }
    this.isRemote = localStorage.getItem(`${environment.cartQR}`) ? true : false;
  }
  private isRoute(route: string): boolean {
    return this.router.url === route;
  }
  comenzar(): void {
    if (!this.isRemote){
      this.router.navigate(['/inicio']);
    } else{
      this.router.navigate(['/seleccion']);
    }
  }
  irLogin(): void {
    // GP: 11 feb 2022
    this.authService.doLogout(false);
    // localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
  ngOnDestroy(): void {
    this.menuPrincipalService.mostrarBotonHamburguesa(true);
    this.menuPrincipalService.mostrarBotonAtras(true);
  }
}
