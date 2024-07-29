import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng-lts/api';
import { DatePipe } from '@angular/common';
import { TableComponent } from '../table/table.component';
import { operationsFunction, operationsFunctionV2 } from '../../enums/operation-function.enum';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-function',
  templateUrl: './add-function.component.html',
  styleUrls: ['./add-function.component.css'],
  providers: [DatePipe]
})
export class AddFunctionComponent implements OnInit{
  //select elements from dom
  @ViewChild('functionElement') functionElement: ElementRef;
  @ViewChild('functionCollabse') functionCollabse: ElementRef;
  //inputs
  @Input() reports:any = [];

  //used for selected function (event)
  _selectedFunction: any[] = [];

  //get selected columns from table
  selectedColumn: any[] = [];

  //used for filter selected column (event)
  _filterSelectedColumn: any;

  //used to show filter operation 
  filterOperationShow: boolean = false;
  //get operations
  operations: any[] = [];

  //random function id
  functionId: any;

  constructor(private confirmationService: ConfirmationService, private tableComponent: TableComponent , private toasterService: ToastrService) { }
  
  ngOnInit(): void {

    //defaults values
    this.functionId = this.getRandomId();
    this.reports = this.tableComponent.reports;

    //handle selected column to sure it is number
    this.selectedColumn = this.tableComponent._selectedColumns
      .map((element) => { 
        return { label: element.field, value: element.field } 
      }).filter((element) => {
        if(!Number.isNaN(parseFloat(this.reports[0][element.value]))){
          return element;
        }
      });
    const headerOption = { label: "اختر عامود", value: null };
    this.selectedColumn.unshift(headerOption);

    //handle operations
    this.operations = [
      { label: 'المجموع', value: { name: 'المجموع', function: operationsFunctionV2.SUMMITION } },
      { label: 'المعدل', value: { name: 'المعدل', function: operationsFunctionV2.AVERAGE } },
      { label: 'الاكبر', value: { name: 'الاكبر', function: operationsFunctionV2.BIGGEST } },
      { label: 'الاصغر', value: { name: 'الاصغر', function: operationsFunctionV2.SMALLEST } },

    ];

    //when table is filtered
    this.tableComponent.isReportsChanged.subscribe((observer) => {
      if(observer == true) 
      {
        if (this.selectedfunction.length != 0) {
          const functions = this.prepareFunctions(this.selectedfunction, this.filterSelectedColumn);
          const functionIndex = this.tableComponent.functionSelected.findIndex((func) => func.id == functions.id);
          if (functionIndex == -1) {
            this.tableComponent.functionSelected.push(functions);
          }
          else {
            this.tableComponent.functionSelected[functionIndex] = functions;
          }
        };

        this.tableComponent.isReportsChanged.next(false);
      }
    })
  }



  get filterSelectedColumn(): any {
    return this._filterSelectedColumn;
  }

  set filterSelectedColumn(val: any) {
    this.filterOperationShow = (val) ? true : false;
    this._filterSelectedColumn = val;

    if (this.selectedfunction.length != 0) {
      const functions = this.prepareFunctions(this.selectedfunction, this.filterSelectedColumn);
      const functionIndex = this.tableComponent.functionSelected.findIndex((func) => func.id == functions.id);
      if (functionIndex == -1) {
        this.tableComponent.functionSelected.push(functions);
      }
      else {
        this.tableComponent.functionSelected[functionIndex] = functions;
      }
    }
  }

  get selectedfunction(): any {
    return this._selectedFunction;
  }

  set selectedfunction(val: any) {
    //restore original order
    this._selectedFunction = val;
    const functions = this.prepareFunctions(val, this.filterSelectedColumn);
    const functionIndex = this.tableComponent.functionSelected.findIndex((func) => func.id == functions.id);
    if (functionIndex == -1) {
      this.tableComponent.functionSelected.push(functions);
    }
    else {
      this.tableComponent.functionSelected[functionIndex] = functions;
    }




  }

  //delete function
  confirmationDeleteFunction(event: any) {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: 'هل تريد حذف الداله؟',
      accept: () => {
        const functionIndex = this.tableComponent.functionSelected.findIndex((func) => func.id == this.functionId);
        if(functionIndex != -1)
        {
          this.tableComponent.functionSelected.splice(functionIndex , 1);
        }

        this.functionElement.nativeElement.remove();
        this.functionCollabse.nativeElement.remove();
        this.toasterService.success('تم حذف الداله بنجاح', 'نجح');

      }
    });
  }


  //function operations
  summation(columnName: string): number {
    const columnData: any[] = [];
    this.tableComponent.reports.forEach((element) => {
      if (!Number.isNaN(parseFloat(element[columnName]))) { columnData.push(element[columnName]); }
    });
    const summition = columnData.reduce((current, accumalator) => parseFloat(current) + parseFloat(accumalator));
    return summition;

  }

  average(columnName: string): number {
    return this.summation(columnName) / this.tableComponent.reports.length;

  }

  biggest(columnName: string): number {
    const columnData: any[] = [];
    this.tableComponent.reports.forEach((element) => {
      if (!Number.isNaN(parseFloat(element[columnName]))) { columnData.push(element[columnName]); }
    });

    return Math.max(...columnData);

  }

  smallest(columnName: string): number {
    const columnData: any[] = [];
    this.tableComponent.reports.forEach((element) => {
      if (!Number.isNaN(parseFloat(element[columnName]))) { columnData.push(element[columnName]); }
    });

    return Math.min(...columnData);

  }



  prepareFunctions(values: any[], column: any): any {
    const columnFunctionsPrepare: any[] = [];
    const hasSumFunction = values.some((element) => element.function == operationsFunctionV2.SUMMITION);
    hasSumFunction ? columnFunctionsPrepare.push({label:"المجموع" , value: this.summation(column)}) : columnFunctionsPrepare.push({label:"المجموع", value: ""});
    const hasAverageFunction = values.some((element) => element.function == operationsFunctionV2.AVERAGE);
    hasAverageFunction ? columnFunctionsPrepare.push({label:"المعدل" , value: this.average(column)}) : columnFunctionsPrepare.push({label:"المعدل" , value: ""});
    const hasBiggestFunction = values.some((element) => element.function == operationsFunctionV2.BIGGEST);
    hasBiggestFunction ? columnFunctionsPrepare.push({label:"اكبر قيمه" , value: this.biggest(column)}) : columnFunctionsPrepare.push({label:"اكبر قيمه" , value: ""});
    const hasSmallestFunction = values.some((element) => element.function == operationsFunctionV2.SMALLEST);
    hasSmallestFunction ? columnFunctionsPrepare.push({label:"اصغر قيمه" , value: this.smallest(column)}) : columnFunctionsPrepare.push({label:"اصغر قيمه" , value: ""});

    return {id:this.functionId , column, functions: columnFunctionsPrepare };
  }


  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `filter-${random}`;
  }
}
export { operationsFunction };

