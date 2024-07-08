import { Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng-lts/api';
import { DatePipe } from '@angular/common';
import { TableComponent } from '../table/table.component';
import { IInputType } from '../../enums/iinput-type.enum';
import { operationsFilter } from '../../enums/ioperations-filter.enum';






@Component({
  selector: 'app-add-filter',
  templateUrl: './add-filter.component.html',
  styleUrls: ['./add-filter.component.css'],
  providers: [DatePipe]
})
export class AddFilterComponent implements OnInit {
  //select elements from dom
  @ViewChild('filterElement') filterElement: ElementRef;
  @ViewChild('filterCollabse') filterCollabse: ElementRef;
  @ViewChild('inputFilter') inputFilter: ElementRef;

  reports: any[] = [];
  inputType: IInputType = {} as IInputType;

  //selected column get from table component
  selectedColumn: any[] = [];
  _filterSelectedColumn: any;

  //used to show input of filter operation
  filterOperationShow: boolean = false;

  //used to select operation
  _selectedOperation: any = null;
  //operations
  operations: any[] = [];
  //used for random filter id
  filterId: any;

  constructor(private confirmationService: ConfirmationService, private tableComponent: TableComponent, private datePipe: DatePipe) { }

  ngOnInit(): void {
    //defaults values
    this.filterId = this.getRandomId();

    //handle selected columns
    this.selectedColumn = this.tableComponent._selectedColumns
      .map((element) => { return { label: element.field, value: element.field } });
    const headerOption = { label: "اختر عامود", value: null };
    this.selectedColumn.unshift(headerOption);

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



  get filterSelectedColumn(): any {
    return this._filterSelectedColumn;
  }

  //filter selected columns
  set filterSelectedColumn(val: any) {
    this.filterOperationShow = (val) ? true : false;
    this._filterSelectedColumn = val;
    if (this.inputFilter != undefined) { this.filter() }
  }

  //to update selected column in case open multi select.
  changeSelectedColumn() {
    this.selectedColumn = this.tableComponent._selectedColumns
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
        this.inputType = IInputType.TEXT;
        break;
      case operationsFilter.LESSTHAN:
      case operationsFilter.MORETHAN:
        this.inputType = IInputType.NUMBER;
        break;
      default:
        this.inputType = IInputType.DATE;

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


    this.tableComponent.reports = allFilterArray;
    this.tableComponent.isReportsChanged.next(true);
  }


  confirmationDeleteFilter(event: any) {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: 'هل تريد حذف التنقيه؟',
      accept: () => {
        this.tableComponent.reports = this.reports;
        this.tableComponent.isReportsChanged.next(true);
        //Actual logic to perform a confirmation
        this.filterElement.nativeElement.remove();
        this.filterCollabse.nativeElement.remove();
      }
    });
  }


  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `filter-${random}`;
  }
}
