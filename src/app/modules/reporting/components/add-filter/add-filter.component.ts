import { Component, ComponentFactory, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng-lts/api';
import Swal from 'sweetalert2';
import { ReportComponent } from '../report/report.component';
import { DatePipe } from '@angular/common';


export enum operationsFilter {
  CONTAIN,
  NOTCONTAIN,
  EQUAL,
  NOTEQUAL,
  MORETHAN,
  LESSTHAN,
  DATE
};

export enum inputType {
  TEXT,
  NUMBER,
  DATE
}

@Component({
  selector: 'app-add-filter',
  templateUrl: './add-filter.component.html',
  styleUrls: ['./add-filter.component.css'],
  providers: [DatePipe]
})
export class AddFilterComponent implements OnInit {
  @ViewChild('filterElement') filterElement: ElementRef;
  @ViewChild('filterCollabse') filterCollabse: ElementRef;
  @ViewChild('inputFilter') inputFilter: ElementRef;

  reports: any[];
  inputType: inputType;
  selectedColumn: any[] = [];
  selectedColumnOptions: any[] = [];
  _filterSelectedColumn: any;
  filterOperationShow: boolean = false;
  _selectedOperation: any = null;
  operations: any[] = [];
  filterId: any;
  dataTarget: any;

  constructor(private confirmationService: ConfirmationService, private _ComponentFactoryResolver: ComponentFactoryResolver, private reportComponent: ReportComponent, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.selectedColumn = this.reportComponent._selectedColumns
      .map((element) => { return { label: element.field, value: element.field } });
    const headerOption = { label: "اختر عامود", value: null };
    this.selectedColumn.unshift(headerOption);

    this.filterId = this.getRandomId();
    this.operations = [
      { label: 'اختر عمليه', value: null },
      { label: 'تحتوى', value: operationsFilter.CONTAIN },
      { label: 'لاتحتوى', value: operationsFilter.NOTCONTAIN },
      { label: 'تساوى', value: operationsFilter.EQUAL },
      { label: 'لاتساوى', value: operationsFilter.NOTEQUAL },
      { label: 'اكبر من', value: operationsFilter.MORETHAN },
      { label: 'اصغر من', value: operationsFilter.LESSTHAN },
      { label: 'بالتاريخ', value: operationsFilter.DATE },
    ]
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
    if (this.inputFilter != undefined) { this.filter() }
  }

  //to update selected column in case open multi select.
  changeSelectedColumn() {
    this.selectedColumn = this.reportComponent._selectedColumns
      .map((element) => { return { label: element.field, value: element.field } });
    const headerOption = { label: "اختر عامود", value: null };
    this.selectedColumn.unshift(headerOption);
  }

  get selectedOperation(): any {
    return this._selectedOperation;
  }

  set selectedOperation(val: any) {
    //restore original order
    this._selectedOperation = val;

    switch (val) {
      case operationsFilter.CONTAIN:
      case operationsFilter.NOTCONTAIN:
      case operationsFilter.EQUAL:
      case operationsFilter.NOTEQUAL:
        this.inputType = inputType.TEXT;
        break;
      case operationsFilter.LESSTHAN:
      case operationsFilter.MORETHAN:
        this.inputType = inputType.NUMBER;
        break;
      default:
        this.inputType = inputType.DATE;

    }



    if (this.inputFilter != undefined) { this.filter() };

  }


  //to filter work with keyup event
  filter() {
    //get input filter value
    const value = this.inputFilter.nativeElement.value;

    let allFilterArray: any[] = [];

    switch (this.selectedOperation) {
      case operationsFilter.CONTAIN:
        allFilterArray = this.reports.filter((row) => row[this.filterSelectedColumn].toString().toLowerCase().includes(value.toString().toLowerCase()));
        break;
      case operationsFilter.NOTCONTAIN:
        allFilterArray = this.reports.filter((row) => !row[this.filterSelectedColumn].toString().toLowerCase().includes(value.toString().toLowerCase()))
        break;
      case operationsFilter.EQUAL:
        allFilterArray = this.reports.filter((row) => row[this.filterSelectedColumn].toString().toLowerCase() == value.toString().toLowerCase());
        break;
      case operationsFilter.NOTEQUAL:
        allFilterArray = this.reports.filter((row) => row[this.filterSelectedColumn].toString().toLowerCase() != value.toString().toLowerCase());
        break;
      case operationsFilter.MORETHAN:
        allFilterArray = this.reports.filter((row) => row[this.filterSelectedColumn] > value);
        break;
      case operationsFilter.LESSTHAN:
        allFilterArray = this.reports.filter((row) => row[this.filterSelectedColumn] < value);
        break;
      default:
        allFilterArray = this.reports.filter((row) => {
          const isDate = new Date(row[this.filterSelectedColumn].toString()).toString();
          console.log(isDate);
          if (isDate != "Invalid Date") {
            return this.datePipe.transform(new Date(isDate), 'yyyy-MM-dd') == value;
          };
        });
        break;
    }


    this.reportComponent.reports = allFilterArray;


  }


  confirmationDeleteFilter(event: any) {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: 'هل تريد حذف التنقيه؟',
      accept: () => {
        this.reportComponent.reports = this.reports;
        //Actual logic to perform a confirmation
        this.filterElement.nativeElement.remove();
        this.filterCollabse.nativeElement.remove();
      }
    });
  }
}
