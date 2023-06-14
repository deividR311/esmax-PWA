import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerComponent } from './ver/ver.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
// PDF
// import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [VerComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule
  //  PdfViewerModule
  ]
})
export class PdfModule { }
