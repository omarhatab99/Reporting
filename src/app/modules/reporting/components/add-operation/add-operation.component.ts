import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng-lts/api';
import { TableComponent } from '../table/table.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-operation',
  templateUrl: './add-operation.component.html',
  styleUrls: ['./add-operation.component.css']
})
export class AddOperationComponent implements OnInit {

  //select elements from dom
  @ViewChild('operationElement') operationElement: ElementRef;
  @ViewChild('operationCollabse') operationCollabse: ElementRef;


  //random function id
  operationId: any;

  advancedOperationObjectDynamic = {
    advancedDataArray: [],
    columnTitle: "",
    selectedOperationType: "onColumns",
    selectedOperationOptionOnTable: "advanced",
    advancedOperationMsgErrors: [],
    addTermToOperation: false,
    termWord: "",
    termWordPosition: "left",
    termWordPositionRight: true,
    termWordPositionLeft: false,
    addLightOnOpertionOnTable: false,
    lightHeading: true,
    lightAllCells: true,
    lightAllColumn: false,
    selectedOperationOnTableColorLightHeading: "",
    selectedOperationOnTableColorLightAllCell: "",
    selectedOperationOnTableColorLightAllColumn: "",
    isOperationUpdated: false,
    selectedColumnsForAdvancedOperation: [],
    updatedColumnTitle: "",
    arthmaticOperationValue:""
  }





  constructor(private confirmationService: ConfirmationService, private tableComponent: TableComponent, private toasterService: ToastrService) { }

  ngOnInit(): void {
    //defaults values
    this.operationId = this.getRandomId();
  }

  //delete function
  confirmationDeleteOperation(event: any) {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: 'هل تريد حذف العمليه الحسابيه ؟',
      accept: () => {

        const columnIndex = this.tableComponent.selectedColumns.findIndex((column) => column.field == this.advancedOperationObjectDynamic.columnTitle);

        console.log(columnIndex);
        //remove column from selected columns
        this.tableComponent.selectedColumns.splice(columnIndex, 1);
        //remove column from object from reports
        this.tableComponent.reports.map((column) => {
          delete column[this.advancedOperationObjectDynamic.columnTitle];
          return column;
        });


        this.operationElement.nativeElement.remove();
        this.operationCollabse.nativeElement.remove();
        this.toasterService.success('تم حذف العمليه بنجاح', 'نجح');



      }
    });
  }


  updateOperationOnTable() {

    for (const key in this.advancedOperationObjectDynamic) {
      this.tableComponent.advancedOperationObject[key] = this.advancedOperationObjectDynamic[key];
    }

    if(this.advancedOperationObjectDynamic.selectedOperationOptionOnTable == "advanced"){
      this.tableComponent.appAdvancedOperationComponent.arthmaticOperatorValue = this.advancedOperationObjectDynamic.arthmaticOperationValue;
      this.tableComponent.advancedOperationObject.selectedColumnsForAdvancedOperation = [];
    }


    this.tableComponent.advancedOperationObject.isOperationUpdated = true;
    this.tableComponent.advancedOperationObject.updatedColumnTitle = this.advancedOperationObjectDynamic.columnTitle;
    this.tableComponent.updatedOperationComponent = this;

    this.tableComponent.showOperationOnTableDialog();
  }



  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `operation-${random}`;
  }
}
