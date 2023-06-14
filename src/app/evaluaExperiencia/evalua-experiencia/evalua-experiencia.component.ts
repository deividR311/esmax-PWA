import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EvaluaExperienciaService } from 'src/app/services/evaluaExperiencia.service';
import { MenuPrincipalService } from '../../services/menu-principal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Experiencia } from 'src/app/model/Experiencia';

export interface Estrella {
  name: string;
  value: number;
}
@Component({
  selector: 'app-evalua-experiencia',
  templateUrl: './evalua-experiencia.component.html',
  styleUrls: ['./evalua-experiencia.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EvaluaExperienciaComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public motivos: string[] = [
    'Facilidad de uso',
    'Formas de Pago',
    'Seguridad',
    'Atención Atendedor',
    'Promociones y beneficios',
    'Rapidez'
  ];
  public estrellas: Estrella[] = [
    {name: 'Pésima',    value: 1 },
    {name: 'Mala',      value: 2 },
    {name: 'Aceptable', value: 3 },
    {name: 'Buena',     value: 4 },
    {name: 'Genial',    value: 5 }
  ];
  public motivoSeleccionado = new Set();

  constructor(private fb: FormBuilder,
              private router: Router,
              private evaluaExperienciaService: EvaluaExperienciaService,
              private menuPrincipalService: MenuPrincipalService,
              private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer
              ) {
    this.menuPrincipalService.mostrarBotonAtras(false);
    this.agregarIconos();
  }

  ngOnInit(): void {
    this.crearControles();
  }
  crearControles(): void {
    this.form = this.fb.group({
      evaluation:    ['', [Validators.required]],
      reason:       ['', [Validators.required]],
      comments:  ['' ],
    });
  }
  seleccionarMotivo(motivo: string): void {
    if (!this.motivoSeleccionado.delete(motivo)) {
      this.motivoSeleccionado.add(motivo);
    }
    this.form.controls.reason.setValue([...this.motivoSeleccionado]);
  }
  finalizar(): void {
    if (this.form.valid) {
      const experiencia: Experiencia = {
        comments: this.form.get('comments')?.value,
        evaluation: this.form.get('evaluation')?.value,
        reason: this.form.get('reason')?.value,
        trxid: localStorage.getItem('TRXID') + ''
      };
      this.evaluaExperienciaService.addExperiencia(experiencia).subscribe((respuesta) => {
        this.router.navigate(['/fin']);
      });
    } else {
      this.router.navigate(['/fin']);
    }
  }

  evaluarConEstrella(opcion: number): void {
    if (opcion) {
      this.form.controls.evaluation.setValue(opcion);
    }
  }

  agregarIconos(): void {
    this.matIconRegistry
      .addSvgIcon('estrella', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/estrella.svg'));
  }

  ngOnDestroy(): void {
    this.menuPrincipalService.mostrarBotonAtras(true);
  }
}
