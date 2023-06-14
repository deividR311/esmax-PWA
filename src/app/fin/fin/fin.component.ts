import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-fin',
  templateUrl: './fin.component.html',
  styleUrls: ['./fin.component.css']
})
export class FinComponent implements OnInit {

  public isRemote: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.isRemote = localStorage.getItem(`${environment.cartQR}`) ? true : false;
  }

}
