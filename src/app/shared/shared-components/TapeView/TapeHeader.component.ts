import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TapeHeaderConfigration } from './TapeHeader.Configration';

@Component({
  selector: 'app-TapeHeader',
  templateUrl: './TapeHeader.component.html',
  styleUrls: ['./TapeHeader.component.css']
})
export class TapeHeaderComponent {
  @Input() TapeViewConfig: TapeHeaderConfigration = new TapeHeaderConfigration();
  @Output() clickHeaderOn=new EventEmitter<any>();
  constructor() {
  }
  clickHeaderOnR(item,index)
  {
    this.clickHeaderOn.emit({item:item,index:index})
  }
}

