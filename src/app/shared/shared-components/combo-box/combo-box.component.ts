import { MessageService } from 'primeng-lts/api';
import { ConfigComboBox } from '../shared-models/config-combo-box';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Dropdown } from 'primeng-lts';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css'],
  providers: [MessageService]
})
export class ComboBoxComponent {
  constructor(private messageService: MessageService) { }
  @Input() ConfigComboBox: ConfigComboBox = new ConfigComboBox("", "", "", "")
  @Input() disabled: boolean = false
  @Input() required: boolean = null
  @Input() ItemSource = [];
  @ViewChild('SelectCombo', { static: false }) drop: Dropdown
  @Output() EventSelectChangeEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() EventClearValueEmitter: EventEmitter<any> = new EventEmitter();
  ngAfterViewInit() {
    setTimeout(() => {
      this.ConfigComboBox.component = this;
    }, 500)
  }
  changeSelect2(newValue: any, Config: ConfigComboBox, dropdown: Dropdown) {
    this.reSelectItem(newValue, dropdown)
    if (newValue != null) {

      this.ConfigComboBox.showClear = true
    }
    else {

      this.ConfigComboBox.showClear = false
    }
    let result = {
      "newValue": newValue,
      "Config": Config
    }
    this.EventSelectChangeEmitter.emit(result);
  }
  clear(comb: any) {
    this.ConfigComboBox.SelectedValue = null
    this.ConfigComboBox.showClear = false
    this.EventClearValueEmitter.emit(comb);
  }
  modelView: boolean = false;
  modelViewError: boolean = false;
  okSave() {
    this.modelView = false;
    if (this.ConfigComboBox.SelectedValue == null) {
      this.messageService.add({ severity: 'warn', summary: 'انتبة', detail: this.ConfigComboBox.MessageAlertError });
    }
  }
  showSelector() {
    this.modelView = true;
  }
  Continua() {
    this.modelViewError = false;
  }
  ngAfterViewChecked() {
    if (this.ConfigComboBox != null && this.ConfigComboBox.appendTo == 'body') {
      try {
        let selectElement4 = this.drop.el.nativeElement.children[0].children[3].children[0].children[0] as HTMLElement;
        selectElement4.style.paddingRight = "2.5em"
      } catch { }
    }
  }

  dropdown: Dropdown = null;
  reSelectItem(newValue: any, dropdown: Dropdown): void {
    this.dropdown = dropdown
    let textShow = "";
    if (newValue != null) {
      this.ConfigComboBox.filterBy.split(',').forEach((item) => {
        textShow += newValue[item.replace("value.", "")] + " - ";
      })
      textShow = textShow.slice(0, textShow.length - 2)
      setTimeout(function () {
        let dropdownSelect2 = dropdown.el.nativeElement.children[0].children[1].children[0]
        dropdownSelect2.innerText = textShow
      }, 50)
    }


  }
}

