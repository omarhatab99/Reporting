import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-sign-input',
  templateUrl: './add-sign-input.component.html',
  styleUrls: ['./add-sign-input.component.css']
})
export class AddSignInputComponent implements OnInit {
  //viewChild varriables
  @ViewChild("inputComponent") inputComponent: ElementRef;

  //inputs varriables
  @Input() value: number = 0;
  @Input() disabled: boolean = false;
  
  //static varriables
  static allValue: number = 0;
  static inputsArray: AddSignInputComponent[] = [];


  //normal varriables
  sign:string;
  createdDynamic:boolean = false;

  //constructors
  constructor(private _TableComponent: TableComponent ,  private toasterService: ToastrService) { }

  ngOnInit(): void {
    AddSignInputComponent.inputsArray.push(this);
  }

  removeInputNumberComponent() {
    if (AddSignInputComponent.inputsArray.length > 1) {



      const inputComponentIndex = AddSignInputComponent.inputsArray.findIndex((comp) => comp == this);
      // AddSignInputComponent.allValue = AddSignInputComponent.allValue - AddSignInputComponent.inputsArray[inputComponentIndex].value;
      // this._TableComponent.operationSpanPreview.nativeElement.innerText = AddSignInputComponent.allValue;
      // this._TableComponent.allInputsValue = AddSignInputComponent.allValue;
      AddSignInputComponent.inputsArray.splice(inputComponentIndex, 1);
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

    calculateAllValue = this.calculateAutomatic();

    AddSignInputComponent.allValue = +calculateAllValue.toFixed(5);
    this._TableComponent.operationSpanPreview.nativeElement.innerText = AddSignInputComponent.allValue;
    this._TableComponent.allInputsValue = AddSignInputComponent.allValue;


  }


  //calculate automatic function
  calculateAutomatic():number{

    let calculateAllValue:number = AddSignInputComponent.inputsArray[0].value;

    AddSignInputComponent.inputsArray.forEach((comp , index) => {
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
