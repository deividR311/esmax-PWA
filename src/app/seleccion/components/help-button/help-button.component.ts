import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoaderService } from 'src/app/shared/utilities/loader.service';

@Component({
  selector: 'app-help-button',
  templateUrl: './help-button.component.html',
  styleUrls: ['./help-button.component.css']
})
export class HelpButtonComponent implements OnInit {
  @Output() buttonFunction: EventEmitter<any> = new EventEmitter();
  openMenu : boolean = false;
  isOver : boolean = false;

  constructor( private loaderService : LoaderService ) { }

  ngOnInit(): void {}
  
  clickMenu(){
    this.openMenu = !this.openMenu;
    (this.openMenu) ? this.loaderService.showBackground() : this.loaderService.hideBackground();
  }

  sendAssistanceNotification() {
    this.buttonFunction.emit('click');
    this.clickMenu();
  }
}
