import { AfterViewInit, Component, ComponentFactoryResolver, DoCheck, ElementRef, Input, OnInit, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ReportComponent } from '../report/report.component';
import { AddFilterComponent } from '../add-filter/add-filter.component';
import { ConfirmationService } from 'primeng-lts/api';
import { AddFunctionComponent } from '../add-function/add-function.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITable } from '../../iterfaces/itable';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { AddInputComponent } from '../add-input/add-input.component';
import { AddSignInputComponent } from '../add-sign-input/add-sign-input.component';
import { AddOperationComponent } from '../add-operation/add-operation.component';
import { AdvancedOperationComponent } from '../advanced-operation/advanced-operation.component';


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
  @ViewChild("arthmaticOperationContainer") arthmaticOperationContainer: ElementRef;
  @ViewChild("advancedDpContainer") advancedDpContainer: ElementRef;
  @ViewChild("appAdvancedOperationComponent") appAdvancedOperationComponent: AdvancedOperationComponent;
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



  isFixedTable: boolean = false;

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
  //selectedOperationType: any = "onColumns";
  //columnTitle: string = "";
  selectedNumberColumns: any[] = [];

  operationOptionsOnTable: any[] = [];

  updatedOperationComponent: AddOperationComponent;


  advancedOperationObject = {
    advancedDataArray: [],
    columnTitle: "",
    selectedOperationType: "onColumns",
    selectedOperationOptionOnTable: "advanced",
    advancedOperationMsgErrors: [],
    addTermToOperation: false,
    termWord: "",
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
    arthmaticOperationValue: ""
  }

  randomArrayLeftTable:any[] = new Array(10);
  randomArrayRightTable:any[] = new Array(10);

  inlineOperationObject = {
    showInlineOperationContainer: false
  }

  constructor(private reportComponent: ReportComponent, private _ComponentFactoryResolver: ComponentFactoryResolver, private confirmationService: ConfirmationService, private toasterService: ToastrService, private contextMenuService: ContextMenuService) { }


  //fire when inputs is changed
  ngOnChanges(changes: SimpleChanges): void {

    //check if cols has bean initialized and table is fixed not dynamic.
    if (this.cols != undefined && this.isFixedTable == false) {
      this.selectedColumns = this.cols;

      //check if selectedColumns has been initialized
      if (this.selectedColumns != undefined) {
        this.selectedNumberColumns = this._selectedColumns.filter((col) => {
          if (!Number.isNaN(parseFloat(this.reports[0][col.field]))) {
            return col;
          }
        });
      }

      //handle selectedNumber columns for multiselect
      this.selectedNumberColumns = this.selectedNumberColumns.map((col) => { return { label: col.field, value: col.field } });

    }

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

    //this.selectedColumns = this.cols;
    if (this.isFixedTable == true) { //dynamic table

      this.reports = this.reportComponent.reports;
      this.cols = this.reportComponent.cols;
      this.selectedColumns = this.cols;


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

    }





    //default values
    this.settingsId = this.getRandomId();
    this.table.width = 98;
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
      { label: 'متقدم', value: 'advanced' },
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

    if (this.advancedOperationObject.isOperationUpdated) //update operation
    {
      //get index of updated column
      const operationColumnUpdatedIndex = this.selectedColumns.findIndex((column) => column.field == this.advancedOperationObject.updatedColumnTitle);

      //check if columntitle is not empty
      if (this.advancedOperationObject.columnTitle != null && this.advancedOperationObject.columnTitle != '' && this.advancedOperationObject.columnTitle != undefined) {

        const hasDublicateColumn = this.selectedColumns
          .some((column, index) => column.field == this.advancedOperationObject.columnTitle && index != operationColumnUpdatedIndex);

        //check that column is not duplicate
        if (!hasDublicateColumn) {

          //chec; selected operation type onColumns or random
          if (this.advancedOperationObject.selectedOperationType == "onColumns") {

            //update column to selected columns
            this.selectedColumns[operationColumnUpdatedIndex] = { field: this.advancedOperationObject.columnTitle, header: this.advancedOperationObject.columnTitle };


            //check operation option is advanced or other option
            if (this.advancedOperationObject.selectedOperationOptionOnTable == "advanced") { //advanced operation

              let advancedDataArrayHandle = [];
              //check if has term
              if (this.advancedOperationObject.addTermToOperation) {
                advancedDataArrayHandle = this.advancedOperationObject.advancedDataArray;
                advancedDataArrayHandle = advancedDataArrayHandle.map(element => {
                  return `${element} ${this.advancedOperationObject.termWord}`
                });
              }

              //delete old values columns from reports
              this.reports.map((column) => {
                delete column[this.advancedOperationObject.updatedColumnTitle];
                return column;
              });

              //add data to main array
              this.reports.forEach((element, index) => {
                element[this.advancedOperationObject.columnTitle] = advancedDataArrayHandle[index];
              });

              //chcek if user selected highlight
              setTimeout(() => {
                const headingElement = this.tableTheadings.find((th) => th.nativeElement.innerText == this.advancedOperationObject.columnTitle);
                if (this.advancedOperationObject.addLightOnOpertionOnTable) {
                  if (this.advancedOperationObject.lightHeading) {
                    headingElement.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightHeading;
                  }

                  if (this.advancedOperationObject.lightAllCells) {
                    this.tableData.forEach((tableDataItem) => {
                      if (tableDataItem.nativeElement.id == `column-${headingElement.nativeElement.innerText}`) {
                        tableDataItem.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllCell;
                      }
                    });
                  }

                  if (this.advancedOperationObject.lightAllColumn) {
                    headingElement.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllColumn;
                    this.tableData.forEach((tableDataItem) => {
                      if (tableDataItem.nativeElement.id == `column-${headingElement.nativeElement.innerText}`) {
                        tableDataItem.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllColumn;
                      }
                    });
                  }
                }


                //set value of arthmatic operation due to used it in case update
                this.advancedOperationObject.arthmaticOperationValue = this.appAdvancedOperationComponent.arthmaticOperationContainer.nativeElement.value;

                //set column using in this operation
                this.advancedOperationObject.selectedColumnsForAdvancedOperation = this.appAdvancedOperationComponent.allElementsWithoutFxAndBracket;


                for (const key in this.updatedOperationComponent.advancedOperationObjectDynamic) {
                  this.updatedOperationComponent.advancedOperationObjectDynamic[key] = this.advancedOperationObject[key];
                }


                //close dialog
                this.closeOperationOnTableDialog();

              }, 0);


            }
            else {
              let dataArray = [];
              //in case operation will done on columns
              if (this.advancedOperationObject.selectedColumnsForAdvancedOperation.length > 0) { //not advanced operation

                //switch of operations
                switch (this.advancedOperationObject.selectedOperationOptionOnTable) {
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


                let advancedDataArrayHandle = [];
                //check if has term
                if (this.advancedOperationObject.addTermToOperation) {
                  advancedDataArrayHandle = this.advancedOperationObject.advancedDataArray;
                  advancedDataArrayHandle = advancedDataArrayHandle.map(element => {
                    return `${element} ${this.advancedOperationObject.termWord}`
                  });
                }

                //delete old values columns from reports
                this.reports.map((column) => {
                  delete column[this.advancedOperationObject.updatedColumnTitle];
                  return column;
                });

                //add value of dataArray to report array
                this.reports.forEach((item, index) => {
                  item[this.advancedOperationObject.columnTitle] = advancedDataArrayHandle[index];
                });

                setTimeout(() => {
                  const headingElement = this.tableTheadings.find((th) => th.nativeElement.innerText == this.advancedOperationObject.columnTitle);
                  //chcek if user selected highlight
                  if (this.advancedOperationObject.addLightOnOpertionOnTable) {
                    if (this.advancedOperationObject.lightHeading) {
                      headingElement.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightHeading;
                    }

                    if (this.advancedOperationObject.lightAllCells) {
                      this.tableData.forEach((tableDataItem) => {
                        if (tableDataItem.nativeElement.id == `column-${headingElement.nativeElement.innerText}`) {
                          tableDataItem.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllCell;
                        }
                      });
                    }

                    if (this.advancedOperationObject.lightAllColumn) {
                      headingElement.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllColumn;
                      this.tableData.forEach((tableDataItem) => {
                        if (tableDataItem.nativeElement.id == `column-${headingElement.nativeElement.innerText}`) {
                          tableDataItem.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllColumn;
                        }
                      });
                    }

                  }


                  for (const key in this.updatedOperationComponent.advancedOperationObjectDynamic) {
                    this.updatedOperationComponent.advancedOperationObjectDynamic[key] = this.advancedOperationObject[key];
                  }


                  //close dialog
                  this.closeOperationOnTableDialog();

                }, 0);

              }
              else {
                this.toasterService.warning('يجب تحديد الاعمدة المطلوبه فى العمليه', 'عذرا');
              }
            }
          }

        }
        else {
          this.toasterService.warning(' اسم العمليه موجود من قبل ', 'عذرا');
        }


      }
      else //columnTitle equal null
      {
        this.toasterService.warning('اسم العمليه لايمكن ان يكون فارغا', 'عذرا');
      }

    }
    else //create operation
    {

      //check if columntitle is not empty
      if (this.advancedOperationObject.columnTitle != null && this.advancedOperationObject.columnTitle != '' && this.advancedOperationObject.columnTitle != undefined) {

        const hasDublicateColumn = this.selectedColumns.some((column) => column.field == this.advancedOperationObject.columnTitle);

        //check if columnTitle is unique name
        if (!hasDublicateColumn) { //column title is valid

          //check selected operation type onColumns or random
          if (this.advancedOperationObject.selectedOperationType == "onColumns") {

            //add column to selected columns
            this.selectedColumns.unshift({ field: this.advancedOperationObject.columnTitle, header: this.advancedOperationObject.columnTitle });

            //check operation option is advanced or other option
            if (this.advancedOperationObject.selectedOperationOptionOnTable == "advanced") { //advanced operation

              let advancedDataArrayHandle = [];
              //check if has term
              if (this.advancedOperationObject.addTermToOperation) {
                advancedDataArrayHandle = this.advancedOperationObject.advancedDataArray;
                advancedDataArrayHandle = advancedDataArrayHandle.map(element => {
                  return `${element} ${this.advancedOperationObject.termWord}`
                });
              }

              //add data to main array
              this.reports.forEach((element, index) => {
                element[this.advancedOperationObject.columnTitle] = advancedDataArrayHandle[index];
              });


              //chcek if user selected highlight
              setTimeout(() => {
                const headingElement = this.tableTheadings['first'];
                if (this.advancedOperationObject.addLightOnOpertionOnTable) {
                  if (this.advancedOperationObject.lightHeading) {
                    headingElement.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightHeading;
                  }

                  if (this.advancedOperationObject.lightAllCells) {
                    this.tableData.forEach((tableDataItem) => {
                      if (tableDataItem.nativeElement.id == `column-${headingElement.nativeElement.innerText}`) {
                        tableDataItem.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllCell;
                      }
                    });
                  }

                  if (this.advancedOperationObject.lightAllColumn) {
                    headingElement.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllColumn;
                    this.tableData.forEach((tableDataItem) => {
                      if (tableDataItem.nativeElement.id == `column-${headingElement.nativeElement.innerText}`) {
                        tableDataItem.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllColumn;
                      }
                    });
                  }
                }

                //create operation component
                const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddOperationComponent);
                const operationComponent = this.operationContainer.createComponent(componentFactory).instance;

                //set value of arthmatic operation due to used it in case update
                this.advancedOperationObject.arthmaticOperationValue = this.appAdvancedOperationComponent.arthmaticOperationContainer.nativeElement.value;
                //set column using in this operation
                this.advancedOperationObject.selectedColumnsForAdvancedOperation = this.appAdvancedOperationComponent.allElementsWithoutFxAndBracket;

                for (const key in operationComponent.advancedOperationObjectDynamic) {
                  operationComponent.advancedOperationObjectDynamic[key] = this.advancedOperationObject[key];
                }

                //close dialog
                this.closeOperationOnTableDialog();

              }, 0);

            }
            else {

              let dataArray = [];
              //in case operation will done on columns
              if (this.advancedOperationObject.selectedColumnsForAdvancedOperation.length > 0) { //not advanced operation

                //switch of operations
                switch (this.advancedOperationObject.selectedOperationOptionOnTable) {
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


                let advancedDataArrayHandle = [];
                //check if has term
                if (this.advancedOperationObject.addTermToOperation) {
                  advancedDataArrayHandle = this.advancedOperationObject.advancedDataArray;
                  advancedDataArrayHandle = advancedDataArrayHandle.map(element => {
                    return `${element} ${this.advancedOperationObject.termWord}`
                  });
                }

                //add value of dataArray to report array
                this.reports.forEach((element, index) => {
                  element[this.advancedOperationObject.columnTitle] = advancedDataArrayHandle[index];
                });

                setTimeout(() => {
                  const headingElement = this.tableTheadings['first'];
                  //chcek if user selected highlight
                  if (this.advancedOperationObject.addLightOnOpertionOnTable) {
                    if (this.advancedOperationObject.lightHeading) {
                      headingElement.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightHeading;
                    }

                    if (this.advancedOperationObject.lightAllCells) {
                      this.tableData.forEach((tableDataItem) => {
                        if (tableDataItem.nativeElement.id == `column-${headingElement.nativeElement.innerText}`) {
                          tableDataItem.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllCell;
                        }
                      });
                    }

                    if (this.advancedOperationObject.lightAllColumn) {
                      headingElement.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllColumn;
                      this.tableData.forEach((tableDataItem) => {
                        if (tableDataItem.nativeElement.id == `column-${headingElement.nativeElement.innerText}`) {
                          tableDataItem.nativeElement.style.backgroundColor = this.advancedOperationObject.selectedOperationOnTableColorLightAllColumn;
                        }
                      });
                    }

                  }

                  //create operation component
                  const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddOperationComponent);
                  const operationComponent = this.operationContainer.createComponent(componentFactory).instance;

                  for (const key in operationComponent.advancedOperationObjectDynamic) {
                    operationComponent.advancedOperationObjectDynamic[key] = this.advancedOperationObject[key];
                  }

                  //close dialog
                  this.closeOperationOnTableDialog();

                }, 0);

              }
              else {
                this.toasterService.warning('يجب تحديد الاعمدة المطلوبه فى العمليه', 'عذرا');
              }
            }
          }

        }
        else {
          this.toasterService.warning(' اسم العمليه موجود من قبل ', 'عذرا');
        }

      }
      else //columnTitle equal null
      {
        this.toasterService.warning('اسم العمليه لايمكن ان يكون فارغا', 'عذرا');
      }
    }
  }




  evaluationOperationDataArray(dataArray) {
    this.advancedOperationObject.advancedDataArray = dataArray;
  }



  //operations function on table
  sumOperationOnTable(): any[] {
    let operationResult: any = 0;
    let dataArray: any[] = [];

    this.reports.forEach((item) => {

      this.advancedOperationObject.selectedColumnsForAdvancedOperation.forEach((col) => {
        operationResult += parseFloat(item[col]);
      });

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

      this.advancedOperationObject.selectedColumnsForAdvancedOperation.forEach((col, index) => {
        //add first value of column to operationResult in case substraction
        if (index == 0)
          operationResult = parseFloat(item[col]);
        else
          operationResult -= parseFloat(item[col]);
      });

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

      this.advancedOperationObject.selectedColumnsForAdvancedOperation.forEach((col, index) => {
        //add first value of column to operationResult in case substraction
        if (index == 0)
          operationResult = parseFloat(item[col]);
        else
          operationResult /= parseFloat(item[col]);
      });

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

      this.advancedOperationObject.selectedColumnsForAdvancedOperation.forEach((col, index) => {
        //add first value of column to operationResult in case substraction
        if (index == 0)
          operationResult = parseFloat(item[col]);
        else
          operationResult *= parseFloat(item[col]);
      });

      //add result to dataArray
      dataArray.push(operationResult);
      operationResult = 0;
    });

    return dataArray;
  }

  closeOperationOnTableDialog() {
    //if advanced reset arthmaticOperation
    if (this.advancedOperationObject.selectedOperationOptionOnTable == "advanced")
      this.appAdvancedOperationComponent.arthmaticOperatorValue = "";

    //reset configuration----------------------------------------------------
    this.advancedOperationObject.columnTitle = "";
    this.advancedOperationObject.selectedOperationType = "onColumns";
    this.advancedOperationObject.selectedOperationOptionOnTable = "advanced";
    this.advancedOperationObject.advancedOperationMsgErrors = [];
    this.advancedOperationObject.addTermToOperation = false;
    this.advancedOperationObject.termWord = "";
    this.advancedOperationObject.isOperationUpdated = false;
    this.advancedOperationObject.arthmaticOperationValue = "";
    //reset colors
    this.advancedOperationObject.addLightOnOpertionOnTable = false;
    this.advancedOperationObject.selectedOperationOnTableColorLightHeading = "";
    this.advancedOperationObject.selectedOperationOnTableColorLightAllCell = "";
    this.advancedOperationObject.selectedOperationOnTableColorLightAllColumn = "";
    this.advancedOperationObject.lightHeading = true;
    this.advancedOperationObject.lightAllCells = true;
    this.advancedOperationObject.lightAllColumn = false;
    this.advancedOperationObject.selectedColumnsForAdvancedOperation = [];
    this.advancedOperationObject.updatedColumnTitle = "";
    this.operationOnTableDialog = false;

  }




  switchLightOperation(event: any, selectedLight: string) {

    //check if selected light is 'column_heading'
    if (selectedLight == 'column_heading') {

      if (event.checked == true) {
        this.advancedOperationObject.lightHeading = true;
        this.advancedOperationObject.lightAllColumn = false;
      }
      else {
        this.advancedOperationObject.lightHeading = false;
      }

    }
    else if (selectedLight == 'column_cells') {

      if (event.checked == true) {

        this.advancedOperationObject.lightAllCells = true;
        this.advancedOperationObject.lightAllColumn = false;
      }
      else {
        this.advancedOperationObject.lightAllCells = false;
      }

    }
    else { //all column lighting
      if (event.checked) {
        this.advancedOperationObject.lightHeading = false;
        this.advancedOperationObject.lightAllCells = false;
        this.advancedOperationObject.lightAllColumn = true;
      }
      else {
        this.advancedOperationObject.lightHeading = true;
        this.advancedOperationObject.lightAllCells = true;
        this.advancedOperationObject.lightAllColumn = false;
      }

    }
  }


  //-------------- make operatio in table inline --------------

  //add new column to table

  addColumnToTable(columnPosition:string){
    this.selectedColumns.push({field:"" , header:""});
  }

  selectedTdForOperation(tableData: any, colData: any) {
    console.log(tableData);
    console.log(colData);



    //check that selected column equal number 
    if (Number.isNaN(parseFloat(colData)) == false) {

      //show inline table operation container
      if (!this.inlineOperationObject.showInlineOperationContainer)
        this.inlineOperationObject.showInlineOperationContainer = true;

      //add background to selected cell 
      tableData.style.backgroundColor = "#28a74542";


    }
    else //cell not number
    {
      this.toasterService.warning(' هذة الخليه لاتحتوى على رقم ', 'عذرا');
    }


  }

  afterContextMenuClose() {
    this.enableContextItem = false;
  }




}
