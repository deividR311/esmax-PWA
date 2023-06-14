import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { interval, Subscription } from 'rxjs';
import { timeout, takeWhile } from 'rxjs/operators';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {

  // spinner 
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;


  pdfSrc = '#';
  iFrameUrl: SafeResourceUrl | undefined;
  encodedUrl: string | undefined;
  finalUrl: string | undefined;
  constructor(private activatedRoute: ActivatedRoute, private pdfService: PdfService, private sanitizer: DomSanitizer) { }

  // iframe!: HTMLIFrameElement;
  isPollingAlive = false;
  private pdfSubscription!: Subscription;

  @ViewChild('iframeContainer')
  iframeContainer!: ElementRef;

  @ViewChild('iFrame')
  iFrame!: ElementRef;

  ngAfterViewInit(): void {
    // this.injectIframe();
  }

  private injectIframe(): void {
    const encodedUrl = encodeURIComponent(this.pdfSrc);
    const container = this.iframeContainer.nativeElement;
    /*
    this.iframe = document.createElement('iframe');
    this.iframe.setAttribute('width', '100%');
    this.iframe.setAttribute('src', this.finalUrl + '');
    this.iframe.setAttribute('height', '100%');
    this.iframe.setAttribute('frameBorder', '3');
    this.iframe.addEventListener('load', this.iframeOnLoad);
    this.iframe.addEventListener('onerror', this.onError);
    this.iframe.addEventListener('onclick', this.onError);
    container.appendChild(this.iframe);
    */
    this.polling();
  }


  public iframeOnLoad(evt: any): void {
    if (evt.target.src.length === 0) { // Documentation workarraund
      if (environment.verbose) { console.log('Primera llamada solo ambientes Chromium'); }
    } else {
      if (environment.verbose) { console.log('iframe/pdf loaded... se termina.'); }
      this.isPollingAlive = false;
    }
  }



 /*
  ngOnInit_deprecated(): void {
    // this.pdfSrc = this.data.path;
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const pdfEncoded = paramMap.get('pdfpath');

      if (!pdfEncoded) {
        console.log('No hay pdf');
      } else {
        this.pdfSrc = decodeURIComponent(window.atob(pdfEncoded));
        const docId = this.pdfSrc.split('docId=', 2);
        if (!environment.production) {
          console.log('Se busca PDF con IDPDF docId: ', docId[1]);
        }

        this.pdfService.getPdfBinary(docId[1]).subscribe(x => {

          if (x) {
            // const linkSource = 'data:application/pdf;base64,' + x.base64;
            // const downloadLink = document.createElement('a');
            // const fileName = 'esmax.pdf';
            // downloadLink.href = linkSource;
            // downloadLink.download = fileName;
            // downloadLink.click();

            // create the blob object with content-type "application/pdf"
            const base64URL = x.base64;
            const binary = atob(base64URL.replace(/\s/g, ''));
            const len = binary.length;
            const buffer = new ArrayBuffer(len);
            const view = new Uint8Array(buffer);

            for (let i = 0; i < len; i += 1) {
              view[i] = binary.charCodeAt(i);
            }

            // create the blob object with content-type "application/pdf"
            const blob = new Blob([view], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            document.body.appendChild(a);

            a.href = url;
            a.download = 'esmax.pdf';
            // a.target = '_blank';
            a.click();

          } else {
            console.log('No hay boleta en la respuesta.');
          }

        }, err => {
          console.log('Error no es posible acceder al servicio.', err);
        }

        );
      }
    });

  } */




  ngOnInit(): void {
    // this.pdfSrc = this.data.path;
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const pdfEncoded = paramMap.get('pdfpath');
      if (!pdfEncoded) {
        console.log('No hay pdf');
      } else {
        this.pdfSrc = decodeURIComponent(window.atob(pdfEncoded));
        this.encodedUrl = encodeURIComponent(this.pdfSrc);
        this.finalUrl = 'https://docs.google.com/viewer?url=' + this.encodedUrl + '&embedded=true';
        this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.finalUrl);
        this.polling();
      }

    });

  }





  /**
  * Timer for iframe
  */
  private polling(): void {

    const frecuencia = 2500; // 2.5 segundos
    const timeOut = 20000;  //  10 segundos
    this.isPollingAlive = true;

    this.pdfSubscription = interval(frecuencia).pipe(
      timeout(timeOut),
      takeWhile(() => this.isPollingAlive),
    ).subscribe(() => {
      if (environment.verbose) {
        const str = this.finalUrl?.substring(0, 10) + '...' + this.finalUrl?.substring(this.finalUrl?.length - 10)
        console.log('pdf src: ', str);
        console.log('Se reitera pedido de pdf');
      }
      this.iFrame.nativeElement.setAttribute('src', this.finalUrl);
    });
  }

}
