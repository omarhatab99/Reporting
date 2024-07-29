import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-input',
  templateUrl: './add-input.component.html',
  styleUrls: ['./add-input.component.css']
})
export class AddInputComponent implements OnInit {
  //viewChild varriable
  @ViewChild("inputComponent") inputComponent: ElementRef;

  //inputs varriable
  @Input() value: number = 0;
  @Input() disabled: boolean = false;

  //static varriables
  static allValue: number = 0;
  static inputsArray: AddInputComponent[] = [];

  //normal varriables
  sign:string;
  createdDynamic:boolean = false;

  //constructors
  constructor(private _TableComponent: TableComponent ,  private toasterService: ToastrService,) { }

  ngOnInit(): void {
    AddInputComponent.inputsArray.push(this);
  }

  removeInputNumberComponent() {
    if (AddInputComponent.inputsArray.length > 2) {

      const inputComponentIndex = AddInputComponent.inputsArray.findIndex((comp) => comp == this);
      // AddInputComponent.allValue = AddInputComponent.allValue - AddInputComponent.inputsArray[inputComponentIndex].value;
      // this._TableComponent.operationSpanPreview.nativeElement.innerText = AddInputComponent.allValue;
      // this._TableComponent.allInputsValue = AddInputComponent.allValue;
      AddInputComponent.inputsArray.splice(inputComponentIndex, 1);
      this.inputComponent.nativeElement.remove();
      this.calculateAllValue();
    }
    else
    {
      this.toasterService.warning("لايمكن حذف هذا الحقل" , "غير مسموح");
    }
  }

  calculateAllValue() {
    
    let calculateAllValue = 0;

    let operationType: any = this._TableComponent.selectedOperationOption;
  
      switch (operationType) {
        case "sum":
          calculateAllValue = this.calculateSum();
          break;
        case "minus":
          calculateAllValue = this.calculateMinus();
          break;
        case "multiply":
          calculateAllValue = this.calculateMultiply();
          break;
        default :
          calculateAllValue = this.calculateDivide();
          break;
      }

    AddInputComponent.allValue = +calculateAllValue.toFixed(5);
    this._TableComponent.operationSpanPreview.nativeElement.innerText = AddInputComponent.allValue;
    this._TableComponent.allInputsValue = AddInputComponent.allValue;


  }

  private calculateSum(): number {
    let calculateAllValue = 0;

    AddInputComponent.inputsArray.forEach((comp) => {
      calculateAllValue += comp.value;
    });

    return calculateAllValue;
  }


  private calculateMinus(): number {

    let calculateAllValue = AddInputComponent.inputsArray[0].value;
    console.log(calculateAllValue);
    AddInputComponent.inputsArray.forEach((comp , index) => {
      if(index > 0){
        calculateAllValue -= comp.value;
      }
    });

    return calculateAllValue;
  }

  private calculateMultiply(): number {
    let calculateAllValue = 1;
    AddInputComponent.inputsArray.forEach((comp) => {
      calculateAllValue *= comp.value;
    });

    return calculateAllValue;
  }

  private calculateDivide(): number {
    let calculateAllValue = 0;
    AddInputComponent.inputsArray.forEach((comp , index) => {
      if(index == 0) {
        calculateAllValue = comp.value;
      }
      else
      {
        calculateAllValue /= comp.value;
      }
      
    });

    return calculateAllValue;
  }

  //calculate automatic function
  calculateAutomatic():number{

    let calculateAllValue:number = AddInputComponent.inputsArray[0].value;

    AddInputComponent.inputsArray.forEach((comp , index) => {
      if(index > 0){

        switch(comp.sign){

          case "sum":
            calculateAllValue += comp.value;
            break;
          case "minus":
            calculateAllValue -= comp.value;
            break;
          case "multiply":
            calculateAllValue *= comp.value;
            break;
          default :
            calculateAllValue /= comp.value;
            break;
        }

      }
    });


    return calculateAllValue;

  }

}
