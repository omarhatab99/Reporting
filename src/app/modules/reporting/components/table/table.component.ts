import { AfterViewInit, Component, ComponentFactoryResolver, DoCheck, ElementRef, Input, OnInit, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ReportComponent } from '../report/report.component';
import { AddFilterComponent } from '../add-filter/add-filter.component';
import { ConfirmationService } from 'primeng-lts/api';
import { AddFunctionComponent } from '../add-function/add-function.component';
import { BehaviorSubject } from 'rxjs';
import { ITable } from '../../iterfaces/itable';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { AddInputComponent } from '../add-input/add-input.component';
import { AddSignInputComponent } from '../add-sign-input/add-sign-input.component';
import { AddOperationComponent } from '../add-operation/add-operation.component';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, DoCheck, AfterViewInit {

  //select view childs from dom
  //elements ref
  @ViewChild("dataSourceTable") dataSourceTable: ElementRef;
  @ViewChild('operationSpanPreview') operationSpanPreview: ElementRef;
  @ViewChild('staticAddInputComponent') staticAddInputComponent: AddInputComponent;
  //container ref
  @ViewChild('filterContainer', { read: ViewContainerRef }) filterContainer!: ViewContainerRef;
  @ViewChild('functionContainer', { read: ViewContainerRef }) functionContainer!: ViewContainerRef;
  @ViewChild('operationContainer', { read: ViewContainerRef }) operationContainer!: ViewContainerRef;
  @ViewChild('inputNumberContainer', { read: ViewContainerRef }) inputNumberContainer!: ViewContainerRef;
  @ViewChild('signInputNumberContainer', { read: ViewContainerRef }) signInputNumberContainer!: ViewContainerRef;

  //template ref
  @ViewChild("settings") settingsTmpl: TemplateRef<any>;
  //contextMenus
  @ViewChild("tableContext") tableContext: ContextMenuComponent;
  //inputs
  @Input() reports: any[] = [];
  @Input() cols: any[] = [];

  @ViewChildren('tableTheading') tableTheadings: ElementRef[];
  @ViewChildren('tableData') tableData: ElementRef[];
  //get object from table
  table: ITable = {} as ITable;
  //used for selected
  //used for export function
  exportColumns: any[] = [];
  _selectedColumns: any[] = [];
  //used for make random id for template ref
  settingsId: any;
  //used for know number of table
  static tableStatic: TableComponent[] = [];
  tableNumber: number;
  functionSelected: any[] = [];
  isReportsChanged: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedCell: HTMLElement;
  selectedCellCol: any;

  colorTableSelectDialog: boolean = false;
  operationOnCellDialog: boolean = false;
  operationOnTableDialog: boolean = false;
  _selectedColorOnlyCell: any = "#f5f55b";
  _selectedColorRowWithoutCell: any = "#f5f55b";
  _selectedColorAllRow: any = "#f5f55b";
  _selectedColorAllColumn: any = "#f5f55b";
  _selectedHighlighOption: any = "onlyCell";
  currentColorElement: any;
  enableContextItem: boolean = false;
  highlightOptions: any[] = [];
  pickColor: any = "#f5f55b";
  pickColorIgnore: any = {
    ignoreSelectedColorOnlyCell: "#f5f55b",
    ignoreSelectedColorWithoutSelected: "#f5f55b",
    ignoreSelectedAllRow: "#f5f55b",
    ignoreSelectedAllColumn: "#f5f55b"
  };

  operationElement: any;
  allInputsValue: number = 0;
  operationOptions: any;
  _selectedOperationOption: any = "sum";
  selectedoperationLimitOptions: any = "sameCell";
  operationLimitOptions: any[] = [];
  basicValue: number = 0;
  _finalAutomaticValue: number = 0;
  cellValue: number = 0;
  operationTypes: any[] = [];
  selectedOperationType: any = "random";
  columnTitle: string = "";
  selectedNumberColumns: any[] = [];
  selectedColumn: any[] = [];
  operationOptionsOnTable: any[] = [];
  selectedOperationOptionOnTable: string = "sum";
  addTermToOperation: boolean = false;
  termWord: string = "";
  termWordPosition: string = "left";
  // test:ConfigComboBox = new ConfigComboBox("اختر العمدة"  , "field,header");
  // thBackgroundColor:string = "#f4f4f4";
  constructor(private reportComponent: ReportComponent, private _ComponentFactoryResolver: ComponentFactoryResolver, private confirmationService: ConfirmationService, private toasterService: ToastrService, private contextMenuService: ContextMenuService) { }


  //fire when inputs is changed
  ngOnChanges(changes: SimpleChanges): void {
    this._selectedColumns = this.cols;

    // if (this._selectedColumns != undefined) {
    //   this.selectedNumberColumns = this._selectedColumns.filter((col) => {
    //     if (!Number.isNaN(parseFloat(this.reports[0][col.field]))) {
    //       return col;
    //     }
    //   });
    // }


    //this.selectedNumberColumns = this.selectedNumberColumns.map((col) => { return { label: col.field, value: col.field } });

  }

  get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }


  get selectedHighlighOption() {
    return this._selectedHighlighOption;
  }

  set selectedHighlighOption(val: any) {
    this._selectedHighlighOption = val;
    switch (this.selectedHighlighOption) {
      case "onlyCell":
        this.pickColor = this.selectedColorOnlyCell;
        break;
      case "allRowWithoutCell":
        this.pickColor = this.selectedColorRowWithoutCell;
        break;
      case "allRow":
        this.pickColor = this.selectedColorAllRow;
        break;
      default:
        this.pickColor = this.selectedColorAllColumn;
        break;
    }
  }

  get selectedColorOnlyCell() {
    return this._selectedColorOnlyCell;
  }

  set selectedColorOnlyCell(val: any) {
    this._selectedColorOnlyCell = val;
  }

  get selectedColorRowWithoutCell() {
    return this._selectedColorRowWithoutCell;
  }

  set selectedColorRowWithoutCell(val: any) {
    this._selectedColorRowWithoutCell = val;
  }

  get selectedColorAllRow() {
    return this._selectedColorAllRow;
  }

  set selectedColorAllRow(val: any) {
    this._selectedColorAllRow = val;

  }

  get selectedColorAllColumn() {
    return this._selectedColorAllColumn;
  }

  set selectedColorAllColumn(val: any) {
    this._selectedColorAllColumn = val;

  }

  get selectedOperationOption() {
    return this._selectedOperationOption;
  }

  set selectedOperationOption(val: any) {
    this._selectedOperationOption = val;


    if (this._selectedOperationOption == "automatic") {
      AddSignInputComponent.inputsArray[AddSignInputComponent.inputsArray.length - 1].calculateAllValue();
    }
    else {
      AddInputComponent.inputsArray[AddInputComponent.inputsArray.length - 1].calculateAllValue();
    }

  }


  changeComplete($event: any) {

    const pickerColor = `rgba(${$event.color.rgb.r} , ${$event.color.rgb.g} , ${$event.color.rgb.b} , ${$event.color.rgb.a})`;
    console.log(this.selectedHighlighOption);
    switch (this.selectedHighlighOption) {
      case "onlyCell":
        this.selectedColorOnlyCell = pickerColor;
        this.pickColor = pickerColor;
        break;
      case "allRowWithoutCell":
        this.selectedColorRowWithoutCell = pickerColor;
        this.pickColor = pickerColor;
        break;
      case "allRow":
        this.selectedColorAllRow = pickerColor;
        this.pickColor = pickerColor;
        break;
      default:
        this._selectedColorAllColumn = pickerColor;
        this.pickColor = pickerColor;
        break;
    }
  }

  handleClickedColor() {
    this.enableContextItem = true;
  }

  //fire in any changed to get index of table in array
  ngDoCheck(): void {
    this.tableNumber = TableComponent.tableStatic.findIndex((component) => component == this) + 1;
  }

  ngOnInit(): void {

    this.reports = this.reportComponent.reports;
    this.cols = this.reportComponent.cols;
    //this.selectedColumns = this.cols;


    //handle selectedNumberColumns
    if (this.selectedColumns != undefined) {
      this.selectedNumberColumns = this.selectedColumns.filter((col) => {
        if (!Number.isNaN(parseFloat(this.reports[0][col.field]))) {
          return col;
        }
      });
    }

    //handle selectedNumberColumns for multiselect
    this.selectedNumberColumns = this.selectedNumberColumns.map((col) => { return { label: col.field, value: col.field } });



    //default values
    this.settingsId = this.getRandomId();
    this.table.width = 100;
    this.table.padding = 10;
    this.table.title = "";
    this.table.tdFontSize = 13;
    this.table.thFontSize = 13;
    //add table to static array
    TableComponent.tableStatic.push(this);
    this.tableNumber = TableComponent.tableStatic.findIndex((component) => component == this) + 1;
    //handle operations
    this.highlightOptions = [
      { label: 'تظليل الخليه فقط', value: 'onlyCell' },
      { label: 'تظليل الصف ماعدا الخلايا المظلله', value: 'allRowWithoutCell' },
      { label: 'تظليل الصف بالكامل', value: 'allRow' },
      { label: 'تظليل العمود بالكامل', value: 'allColumn' }
    ];

    //handle operations
    this.operationOptions = [
      { label: 'جمع', value: 'sum' },
      { label: 'طرح', value: 'minus' },
      { label: 'ضرب', value: 'multiply' },
      { label: 'قسمه', value: 'divide' },
      { label: 'متقدم', value: 'automatic' }
    ];

    this.operationLimitOptions = [
      { label: 'على مستوى الخليه', value: 'sameCell' },
      { label: 'على مستوى العمود', value: 'allColumn' },
    ];

    this.operationTypes = [
      { label: 'عمليه عشوائيه', value: "random" },
      { label: 'عمليه على الاعمدة', value: "onColumns" },
    ];

    this.operationOptionsOnTable = [
      { label: 'جمع', value: 'sum' },
      { label: 'طرح', value: 'minus' },
      { label: 'ضرب', value: 'multiply' },
      { label: 'قسمه', value: 'divide' },
    ];


  }


  ngAfterViewInit() {
    Promise.resolve().then(() => this.reportComponent.showHeaderTemplate(this.settingsTmpl));

    setTimeout(() => {

      this.tableTheadings.forEach(tablehead => {
        tablehead.nativeElement.style.backgroundColor = "#F4F4F4";
      });

    }, 1000);

  }

  public onContextMenu($event: MouseEvent, item: HTMLElement, col: any, type: any): void {
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.tableContext,
      event: $event,
      item: { item, col, type },

    });

    this.selectedCell = item;
    this.selectedCellCol = col;

    this.currentColorElement = getComputedStyle(item).backgroundColor;
    console.log(this.currentColorElement);

    $event.preventDefault();
    $event.stopPropagation();
  }


  //delete text box element
  confirmationDeleteTable(event: any) {
    event.stopPropagation();
    this.confirmationService.confirm({
      message: 'هل انت متاكد من حذف العنصر لن تكون قادر على استعادته',
      accept: () => {
        //Actual logic to perform a confirmation
        this.dataSourceTable.nativeElement.remove();
        //const index = this.reportComponent.headerTemplate.findIndex((element) => element == this.settingsTmpl);
        const tableIndex = TableComponent.tableStatic.findIndex((compnent) => compnent == this);
        TableComponent.tableStatic.splice(tableIndex, 1);
        this.reportComponent.headerTemplate.splice(tableIndex, 1);
        this.toasterService.success('تم حذف الجدول بنجاح', 'نجح');
      }
    });
  }


  //create new filter
  createNewFilter() {
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddFilterComponent);
    const filterComponent = this.filterContainer.createComponent(componentFactory).instance;
    filterComponent.reports = this.reports;
  }

  //create new function
  createNewFunction() {
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddFunctionComponent);
    this.functionContainer.createComponent(componentFactory).instance;
  }
  //create new operation
  createNewOperation() {

    //show table dialog
    this.showOperationOnTableDialog();

    // const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddOperationComponent);
    // this.operationContainer.createComponent(componentFactory).instance;
  }
  //export pdf

  exportPdf() {
    //this.exportColumns = this.selectedColumns.map(col => ({ title: col.header, dataKey: col.field }));
    html2canvas(this.dataSourceTable.nativeElement).then((imageCanvas) => {

      const imgData = imageCanvas.toDataURL("image/png");

      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = imageCanvas.height * imgWidth / imageCanvas.width;
      var heightLeft = imgHeight;

      var doc = new jsPDF('p', 'mm', 'a4');
      var position = 10;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save('reporting-table' + '.pdf')

    })


  }


  //export excel
  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.reports);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });

      this.saveAsExcelFile(excelBuffer, "report");
    }); 8
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }




  //get random id
  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `settings-${random}`;
  }


  //-----------------------------
  highlightCell(element: any, specification) {
    if (element.type == "th") {
      switch (specification) {
        case "onlyCell":
          element.item.style.backgroundColor = this.selectedColorOnlyCell;
          element.item.setAttribute("data-highlight", this.selectedColorOnlyCell);
          break;
        case "allRowWithoutHighlight":
          this.tableTheadings.forEach(tablehead => {
            if (tablehead.nativeElement.getAttribute("data-highlight") == null) {
              console.log(tablehead.nativeElement.getAttribute("data-highlight"))
              tablehead.nativeElement.style.backgroundColor = this.selectedColorRowWithoutCell;
            }
          });
          break;
        case "allRow":
          this.tableTheadings.forEach(tablehead => {
            tablehead.nativeElement.style.backgroundColor = this.selectedColorAllRow;
          });
          break;
        default:
          element.item.style.backgroundColor = this.selectedColorAllColumn;
          this.tableData.forEach((tableDataItem) => {
            if (tableDataItem.nativeElement.id == `column-${element.col.field}`) {
              tableDataItem.nativeElement.style.backgroundColor = this.selectedColorAllColumn;
            }
          })
          break
      }
    }

    if (element.type == "td") {
      const tr = element.item.closest("tr");
      switch (specification) {
        case "onlyCell":
          element.item.style.backgroundColor = this.selectedColorOnlyCell;
          element.item.setAttribute("data-highlight", this.selectedColorOnlyCell);
          break;
        case "allRowWithoutHighlight":
          Array.from(tr.children).forEach((td: any) => {
            if (td.getAttribute("data-highlight") == null) {
              td.style.backgroundColor = this.selectedColorRowWithoutCell;
            }
          });
          break;
        case "allRow":
          Array.from(tr.children).forEach((td: any) => {
            td.style.backgroundColor = this.selectedColorAllRow;
          });
          break;
        default:
          const tableHeadingParent = this.tableTheadings.find((el) => el.nativeElement.innerText == element.col.field);
          tableHeadingParent.nativeElement.style.backgroundColor = this.selectedColorAllColumn;
          this.tableData.forEach((tableDataItem) => {
            if (tableDataItem.nativeElement.id == `column-${element.col.field}`) {
              tableDataItem.nativeElement.style.backgroundColor = this.selectedColorAllColumn;
            }
          })
          break
      }
    }



  }

  removeHighlightCell(element: any, specification) {

    if (element.type == "th") {
      const tr = element.item.closest("tr");
      tr.style.backgroundColor = "#F4F4F4"
      switch (specification) {
        case "onlyCell":
          element.item.style.backgroundColor = "#F4F4F4";
          element.item.removeAttribute("data-highlight");
          break;
        case "allRowWithoutHighlight":
          this.tableTheadings.forEach(tablehead => {
            if (tablehead.nativeElement.getAttribute("data-highlight") == null) {
              tablehead.nativeElement.style.backgroundColor = "#F4F4F4"
              tablehead.nativeElement.removeAttribute("data-highlight");
            }
          });
          break;
        case "allRow":
          this.tableTheadings.forEach(tablehead => {
            tablehead.nativeElement.style.backgroundColor = "#F4F4F4";
          });
          break;
        default:
          element.item.style.backgroundColor = "#F4F4F4";;
          this.tableData.forEach((td) => {
            if (td.nativeElement.id == `column-${element.col.field}`) {
              td.nativeElement.style.backgroundColor = "transparent";
            }
          })
          break
      }
    }

    if (element.type == "td") {
      const tr = element.item.closest("tr");
      switch (specification) {
        case "onlyCell":
          element.item.style.backgroundColor = "transparent";
          element.item.removeAttribute("data-highlight");
          break;
        case "allRowWithoutHighlight":
          Array.from(tr.children).forEach((td: any) => {
            if (td.getAttribute("data-highlight") == null) {
              td.removeAttribute("data-highlight");
              td.style.backgroundColor = "transparent";
            }
          });
          break;
        case "allRow":
          Array.from(tr.children).forEach((td: any) => {
            td.removeAttribute("data-highlight");
            td.style.backgroundColor = "transparent";
          });
          break;
        default:
          const tableHeadingParent = this.tableTheadings.find((el) => el.nativeElement.innerText == element.col.field);
          tableHeadingParent.nativeElement.style.backgroundColor = "#F4F4F4";
          this.tableData.forEach((td) => {
            if (td.nativeElement.id == `column-${element.col.field}`) {
              td.nativeElement.removeAttribute("data-highlight");
              td.nativeElement.style.backgroundColor = "transparent"
            }
          })
          break
      }
    }
  }

  showColorDialog() {
    this.colorTableSelectDialog = true;
  }

  showOperationOnCellDialog() {

    this.operationOnCellDialog = true;
  }

  saveColorTableDialog() {

    this.pickColorIgnore.ignoreSelectedColorOnlyCell = this.selectedColorOnlyCell;
    this.pickColorIgnore.ignoreSelectedColorWithoutSelected = this.selectedColorRowWithoutCell;
    this.pickColorIgnore.ignoreSelectedAllRow = this.selectedColorAllRow;
    this.pickColorIgnore.ignoreSelectedAllColumn = this.selectedColorAllColumn;
    this.colorTableSelectDialog = false;

  }

  closeColorTableDialog() {


    this.selectedColorOnlyCell = this.pickColorIgnore.ignoreSelectedColorOnlyCell;
    this.selectedColorRowWithoutCell = this.pickColorIgnore.ignoreSelectedColorWithoutSelected;
    this.selectedColorAllRow = this.pickColorIgnore.ignoreSelectedAllRow;
    this.selectedColorAllColumn = this.pickColorIgnore.ignoreSelectedAllColumn;
    this.pickColor = this.selectedColorOnlyCell;
    this.selectedHighlighOption = "onlyCell";
    this.colorTableSelectDialog = false;

  }

  saveOperationOnCellDialog() {
    this.operationElement.innerText = this.allInputsValue;
    this.staticAddInputComponent.value = 0;
    this.selectedOperationOption = "sum";
    this.inputNumberContainer.clear();
    this.signInputNumberContainer.clear();
    this.operationOnCellDialog = false;
  }

  closeOperationOnCellDialog() {

    this.staticAddInputComponent.value = 0;
    this.selectedOperationOption = "sum";
    this.inputNumberContainer.clear();
    this.signInputNumberContainer.clear();
    this.operationOnCellDialog = false;
  }


  doOperation(element: any) {

    if (!Number.isNaN(parseFloat(element.item.innerText))) {
      this.operationElement = element.item;
      this.operationSpanPreview.nativeElement.innerText = parseFloat(element.item.innerText);
      AddInputComponent.inputsArray[0].value = parseFloat(element.item.innerText);
      this.cellValue = parseFloat(element.item.innerText);
      this.showOperationOnCellDialog();
    }
    else {
      this.toasterService.warning("هذة الخليه لاتحتوى على عدد", "لايمكن");
    }

  }

  addInputNumber() {

    const hasEmptyValue = AddInputComponent.inputsArray.some((comp) => comp.value == 0 || comp.value == undefined || comp.value == null);

    if (!hasEmptyValue) {
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddInputComponent);
      const inputAddInputComp = this.inputNumberContainer.createComponent(componentFactory);
      inputAddInputComp.instance.createdDynamic = true;
    }
    else {
      this.toasterService.warning('لايمكن اضافه حقل  قيمته صفر', 'لايمكن');
    }


  }

  addSignInputNumber(sign: string) {

    const hasEmptyValue = AddSignInputComponent.inputsArray.some((comp) => comp.value == 0 || comp.value == undefined || comp.value == null);
    console.log(AddSignInputComponent.inputsArray);
    if (!hasEmptyValue) {
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddSignInputComponent);
      const inputAddInputComp = this.signInputNumberContainer.createComponent(componentFactory);
      inputAddInputComp.instance.createdDynamic = true;
      inputAddInputComp.instance.sign = sign;
    }
    else {
      this.toasterService.warning('لايمكن اضافه حقل  قيمته صفر', 'لايمكن');

    }

  }

  showOperationOnTableDialog() {
    this.operationOnTableDialog = true;
  }

  saveOperationOnTableDialog() {


    //check if columntitle is not empty
    if (this.columnTitle != null && this.columnTitle != '' && this.columnTitle != undefined) {

      let dataArray: any[] = [];

      //chec; selected operation type onColumns or random
      if (this.selectedOperationType == "onColumns") {
        //in case operation will done on columns
        if (this.selectedColumn.length > 0) {

          //add column to selected columns
          this.selectedColumns.unshift({ field: this.columnTitle, header: this.columnTitle });

          //switch of operations
          switch (this.selectedOperationOptionOnTable) {

            case "sum":
              dataArray = this.sumOperationOnTable();
              break;
            case "minus":
              dataArray = this.minusOperationOnTable();
              break;
            case "divide":
              dataArray = this.divideOperationOnTable();
              break;
            default:
              dataArray = this.multiplyOperationOnTable();
              break;

          };

          //add value of dataArray to report array
          this.reports.forEach((item, index) => {
            item[this.columnTitle] = dataArray[index];
          });

          //create operation component
          const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddOperationComponent);
          const operationComponent = this.operationContainer.createComponent(componentFactory).instance;
          operationComponent.columnTitle = this.columnTitle;
          operationComponent.selectedOperationType = this.selectedOperationType;
          operationComponent.selectedOperationOptionOnTable = this.selectedOperationOptionOnTable;
          operationComponent.addTermToOperation = this.addTermToOperation;
          operationComponent.termWord = this.termWord;
          operationComponent.termWordPosition = this.termWordPosition;
          operationComponent.selectedColumn = this.selectedColumn;
          //close dialog
          this.closeOperationOnTableDialog();

        }
        else {
          this.toasterService.warning('يجب تحديد الاعمدة المطلوبه فى العمليه', 'عذرا');
        }

      }
      else //in case operation will be random
      {



      }



    }
    else //columnTitle equal null
    {
      this.toasterService.warning('اسم العمليه لايمكن ان يكون فارغا', 'عذرا');
    }
    // switch(this.selectedOperationOptionOnTable) {

    //   case "sum" :
    //     this.sumOperationOnTable();
    //     break;

    // }

    // this._selectedColumns.unshift({field:"الاجمالى" , header:"الاجمالى"});
    // this.reports.forEach((obj) => {
    //   obj['الاجمالى'] = 20000
    // });

    // console.log(this._selectedColumns);
    // console.log(this.reports);
  }



  //operations function on table
  sumOperationOnTable(): any[] {
    let operationResult: any = 0;
    let dataArray: any[] = [];

    this.reports.forEach((item) => {

      this.selectedColumn.forEach((col) => {
        operationResult += parseFloat(item[col]);
      });

      //check if user selected addTermToOperation
      if (this.addTermToOperation) { //user selected to addTermToOperation

        //check postion of term of operation
        if (this.termWordPosition == "left")
          operationResult = this.termWord + ' ' + operationResult;
        else
          operationResult = operationResult + ' ' + this.termWord;
      }

      //add result to dataArray
      dataArray.push(operationResult);
      operationResult = 0;
    });

    console.log(dataArray);
    return dataArray;
  }
  minusOperationOnTable(): any[] {
    let operationResult: any = 0;
    let dataArray: any[] = [];

    this.reports.forEach((item) => {

      this.selectedColumn.forEach((col, index) => {
        //add first value of column to operationResult in case substraction
        if (index == 0)
          operationResult = parseFloat(item[col]);
        else
          operationResult -= parseFloat(item[col]);
      });

      //check if user selected addTermToOperation
      if (this.addTermToOperation) { //user selected to addTermToOperation

        //check postion of term of operation
        if (this.termWordPosition == "left")
          operationResult = this.termWord + ' ' + operationResult;
        else
          operationResult = operationResult + ' ' + this.termWord;

      }
      //add result to dataArray
      dataArray.push(operationResult);
      operationResult = 0;
    });

    return dataArray;
  }
  divideOperationOnTable(): any[] {
    let operationResult: any = 0;
    let dataArray: any[] = [];

    this.reports.forEach((item) => {

      this.selectedColumn.forEach((col, index) => {
        //add first value of column to operationResult in case substraction
        if (index == 0)
          operationResult = parseFloat(item[col]);
        else
          operationResult /= parseFloat(item[col]);
      });

      //check if user selected addTermToOperation
      if (this.addTermToOperation) { //user selected to addTermToOperation

        //check postion of term of operation
        if (this.termWordPosition == "left")
          operationResult = this.termWord + ' ' + operationResult;
        else
          operationResult = operationResult + ' ' + this.termWord;

      }
      //add result to dataArray
      dataArray.push(operationResult);
      operationResult = 0;
    });

    return dataArray;
  }
  multiplyOperationOnTable(): any[] {
    let operationResult: any = 0;
    let dataArray: any[] = [];

    this.reports.forEach((item) => {

      this.selectedColumn.forEach((col, index) => {
        //add first value of column to operationResult in case substraction
        if (index == 0)
          operationResult = parseFloat(item[col]);
        else
          operationResult *= parseFloat(item[col]);
      });

      //check if user selected addTermToOperation
      if (this.addTermToOperation) { //user selected to addTermToOperation

        //check postion of term of operation
        if (this.termWordPosition == "left")
          operationResult = this.termWord + ' ' + operationResult;
        else
          operationResult = operationResult + ' ' + this.termWord;

      }
      //add result to dataArray
      dataArray.push(operationResult);
      operationResult = 0;
    });

    return dataArray;
  }

  closeOperationOnTableDialog() {
    this.operationOnTableDialog = false;
  }


  afterContextMenuClose() {
    this.enableContextItem = false;
  }



}
