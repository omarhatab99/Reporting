import { Component, ComponentFactoryResolver, DoCheck, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng-lts/api';
import { DatePipe } from '@angular/common';
import { TableComponent } from '../table/table.component';

export enum operationsFunction {
  SUMMITION,
  AVERAGE,
  BIGGEST,
  SMALLEST
};

@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css'],
  providers: [DatePipe]
})
export class FunctionComponent implements OnInit{

  @ViewChild('functionElement') functionElement: ElementRef;
  @ViewChild('functionCollabse') functionCollabse: ElementRef;
  @Input() reports:any = [];

  _selectedFunction: any[] = [];

  selectedColumn: any[] = [];
  _filterSelectedColumn: any;
  filterOperationShow: boolean = false;
  operations: any[] = [];
  functionId: any;
  constructor(private confirmationService: ConfirmationService, private _ComponentFactoryResolver: ComponentFactoryResolver, private tableComponent: TableComponent, private datePipe: DatePipe) { }
  
  ngOnChanges(changes: SimpleChanges): void {

    console.log(changes);
  }

  ngOnInit(): void {
    this.reports = this.tableComponent.reports;
    this.selectedColumn = this.tableComponent._selectedColumns
      .map((element) => { 
        return { label: element.field, value: element.field } 
      }).filter((element) => {
        if(!Number.isNaN(parseFloat(this.reports[0][element.value]))){
          return element;
        }
      })

      console.log(this.selectedColumn)
    const headerOption = { label: "اختر عامود", value: null };
    this.selectedColumn.unshift(headerOption);

    this.functionId = this.getRandomId();
    this.operations = [
      { label: 'المجموع', value: { name: 'المجموع', function: operationsFunction.SUMMITION } },
      { label: 'المعدل', value: { name: 'المعدل', function: operationsFunction.AVERAGE } },
      { label: 'الاكبر', value: { name: 'الاكبر', function: operationsFunction.BIGGEST } },
      { label: 'الاصغر', value: { name: 'الاصغر', function: operationsFunction.SMALLEST } },

    ];

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

  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `filter-${random}`;
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
      }
    });
  }


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
    const hasSumFunction = values.some((element) => element.function == operationsFunction.SUMMITION);
    hasSumFunction ? columnFunctionsPrepare.push({label:"المجموع" , value: this.summation(column)}) : columnFunctionsPrepare.push({label:"المجموع", value: ""});
    const hasAverageFunction = values.some((element) => element.function == operationsFunction.AVERAGE);
    hasAverageFunction ? columnFunctionsPrepare.push({label:"المعدل" , value: this.average(column)}) : columnFunctionsPrepare.push({label:"المعدل" , value: ""});
    const hasBiggestFunction = values.some((element) => element.function == operationsFunction.BIGGEST);
    hasBiggestFunction ? columnFunctionsPrepare.push({label:"اكبر قيمه" , value: this.biggest(column)}) : columnFunctionsPrepare.push({label:"اكبر قيمه" , value: ""});
    const hasSmallestFunction = values.some((element) => element.function == operationsFunction.SMALLEST);
    hasSmallestFunction ? columnFunctionsPrepare.push({label:"اصغر قيمه" , value: this.smallest(column)}) : columnFunctionsPrepare.push({label:"اصغر قيمه" , value: ""});

    return {id:this.functionId , column, functions: columnFunctionsPrepare };
  }
}
