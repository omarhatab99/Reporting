import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CheckBoxList } from './ConfigCheckBoxList';
import { Listbox } from 'primeng-lts';
@Component({
  selector: 'app-CheckBoxList',
  templateUrl: './CheckBoxList.component.html',
  styleUrls: ['./CheckBoxList.component.css'],
})
export class CheckBoxListComponent implements AfterViewInit{
  @Input() CheckBoxListConfig: CheckBoxList = new CheckBoxList();
  @Output() OnChangeItem: EventEmitter<any> = new EventEmitter();
  @ViewChild('listBox', { static: true }) listBox: Listbox
  ngAfterViewInit(): void {
    let ListBox = this.listBox.el.nativeElement as HTMLElement;
    let BodyListBox = ListBox.querySelector('.ui-listbox .ui-listbox-list-wrapper') as HTMLElement
    BodyListBox.style.height = this.CheckBoxListConfig.Height + "px"
  }

  onChangeValue(dataSelect: Array<any>) {
    this.CheckBoxListConfig.ItemSource.forEach((itemS) => {
      itemS[this.CheckBoxListConfig.valueChange] = false;
    })
    dataSelect.forEach(item => {
      item[this.CheckBoxListConfig.valueChange] = true;
    })
    this.OnChangeItem.emit(dataSelect)
  }

}
