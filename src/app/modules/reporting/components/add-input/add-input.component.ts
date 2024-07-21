import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-add-input',
  templateUrl: './add-input.component.html',
  styleUrls: ['./add-input.component.css']
})
export class AddInputComponent implements OnInit {
  @ViewChild("inputComponent") inputComponent:ElementRef;
  @Input() value:number = 0;
  @Input() isFixedComponent:boolean = false;
  static allValue:number = 0;

  static inputsArray:AddInputComponent[] = [];
  createdDynamic:boolean = false;

  constructor(private _TableComponent:TableComponent) { }

  ngOnInit(): void {
    AddInputComponent.inputsArray.push(this);
  }

  removeInputNumberComponent(){
    if(AddInputComponent.inputsArray.length > 2){
      const inputComponentIndex = AddInputComponent.inputsArray.findIndex((comp) => comp == this);
      AddInputComponent.allValue = AddInputComponent.allValue  - AddInputComponent.inputsArray[inputComponentIndex].value;
      this._TableComponent.operationSpanPreview.nativeElement.innerText = AddInputComponent.allValue;
      this._TableComponent.allInputsValue = AddInputComponent.allValue;
      AddInputComponent.inputsArray.splice(inputComponentIndex , 1);
      this.inputComponent.nativeElement.remove();
    }
  }

  calculateAllValue(){
    let calculateAllValue = 0;
    AddInputComponent.inputsArray.forEach((comp) => {
      calculateAllValue += comp.value;
    });
    AddInputComponent.allValue = calculateAllValue;
    this._TableComponent.operationSpanPreview.nativeElement.innerText = AddInputComponent.allValue;
    this._TableComponent.allInputsValue = AddInputComponent.allValue;
  }

}
