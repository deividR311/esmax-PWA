import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuPrincipalService } from '../../services/menu-principal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public origen = '';
  public mensajeMostrar = '';
  constructor(private router: Router, private menuPrincipalService: MenuPrincipalService) {
    this.menuPrincipalService.mostrarBotonHamburguesa(true);
    this.menuPrincipalService.mostrarBotonAtras(false);
  }

  ngOnInit(): void {
    this.menuPrincipalService.mostrarBotonHamburguesa(true);
    this.menuPrincipalService.mostrarBotonAtras(false);
  }

  comenzar(): void {
    this.router.navigate(['/seleccion']);
  }
  irLogin(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.menuPrincipalService.mostrarBotonHamburguesa(true);
    this.menuPrincipalService.mostrarBotonAtras(true);
  }

}
