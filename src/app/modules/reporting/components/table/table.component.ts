import { AfterViewInit, Component, ComponentFactoryResolver, DoCheck, ElementRef, Input, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ReportComponent } from '../report/report.component';
import { AddFilterComponent } from '../add-filter/add-filter.component';
import { ConfirmationService } from 'primeng-lts/api';
import { FunctionComponent } from '../function/function.component';
import { BehaviorSubject } from 'rxjs';
import { ITable } from '../../iterfaces/itable';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, DoCheck, AfterViewInit {

  //select view childs from dom
  //elements ref
  @ViewChild("dataSourceTable") dataSourceTable: ElementRef;
  //container ref
  @ViewChild('filterContainer', { read: ViewContainerRef }) filterContainer!: ViewContainerRef;
  @ViewChild('functionContainer', { read: ViewContainerRef }) functionContainer!: ViewContainerRef;
  //template ref
  @ViewChild("settings") settingsTmpl: TemplateRef<any>;
  //contextMenus
  @ViewChild("tableContext") tableContext: ContextMenuComponent;
  //inputs
  @Input() reports: any[] = [];sss
  @Input() cols: any[] = [];

  @ViewChildren('tableTheading') tableTheadings:ElementRef[];
  @ViewChildren('tableData') tableData:ElementRef[];
  //get object from table
  table: ITable = {} as ITable;
  //used for selected
  selectedReport: any;
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
  selectedCell:HTMLElement;
  colorTableSelectDialog:boolean = false;
  _selectedColorOnlyCell:any = "#f5f55b";
  _selectedColorRowWithoutCell:any = "#f5f55b";
  _selectedColorAllRow:any = "#f5f55b";
  _selectedColorAllColumn:any = "#f5f55b";

  currentColorElement:any;
  enableContextItem:boolean = false;
  // thBackgroundColor:string = "#f4f4f4";
  constructor(private reportComponent: ReportComponent, private _ComponentFactoryResolver: ComponentFactoryResolver, private confirmationService: ConfirmationService , private toasterService: ToastrService, private contextMenuService: ContextMenuService , private renderer:Renderer2) { }

  //fire when inputs is changed
  ngOnChanges(changes: SimpleChanges): void {
    this._selectedColumns = this.cols;
  }

  get selectedColorOnlyCell(){
    return this._selectedColorOnlyCell;
  }

  set selectedColorOnlyCell(val:any){
    this._selectedColorOnlyCell = val;
  }

  get selectedColorRowWithoutCell(){
    return this._selectedColorRowWithoutCell;
  }

  set selectedColorRowWithoutCell(val:any){
    this._selectedColorRowWithoutCell = val;

  }

  get selectedColorAllRow(){
    return this._selectedColorAllRow;
  }

  set selectedColorAllRow(val:any){
    this._selectedColorAllRow = val;

  }

  get selectedColorAllColumn(){
    return this._selectedColorAllColumn;
  }

  set selectedColorAllColumn(val:any){
    this._selectedColorAllColumn = val;

  }

  test($event:Event){
    console.log($event)
  }


  // select($event:Event) {
  //   console.log($event)
  // }
  handleClickedColor(){
    this.enableContextItem = true; 
    console.log(this.enableContextItem)
  }

  //fire in any changed to get index of table in array
  ngDoCheck(): void {
    this.tableNumber = TableComponent.tableStatic.findIndex((component) => component == this) + 1;
  }

  ngOnInit(): void {
    
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
  }


  ngAfterViewInit() {
    Promise.resolve().then(() => this.reportComponent.showHeaderTemplate(this.settingsTmpl));
  }

  public onContextMenu($event: MouseEvent, item: HTMLElement , col:any): void {
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.tableContext,
      event: $event,
      item: {item , col},
      
    });

    this.selectedCell = item;
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

  get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));

  }

  //create new filter
  createNewFilter() {
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddFilterComponent);
    const filterComponent = this.filterContainer.createComponent(componentFactory).instance;
    filterComponent.reports = this.reports;
  }

  //create new function
  createNewFunction() {
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(FunctionComponent);
    this.functionContainer.createComponent(componentFactory).instance;
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
  
        var doc = new jsPDF('p' , 'mm' , 'a4');
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
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' , cellStyles:true});
      
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
  highlightCell(element:any , specification){
    console.log(element);

    switch(specification){
      case "onlyCell":
        element.item.style.backgroundColor = this.selectedColorOnlyCell;
        element.item.setAttribute("data-highlight" , this.selectedColorOnlyCell);
        break;
      case "allRowWithoutHighlight":
        this.tableTheadings.forEach(tablehead => {
          if(tablehead.nativeElement.getAttribute("data-highlight") == null){
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
      default :
      element.item.style.backgroundColor = this.selectedColorAllColumn;
          this.tableData.forEach((tableDataItem) => {
            if(tableDataItem.nativeElement.id == `column-${element.col.field}`){
              tableDataItem.nativeElement.style.backgroundColor = this.selectedColorAllColumn;
            }
          })
        break
    }
    
  
  }


  changeColorDialog(){
    this.colorTableSelectDialog = true;
  }

  afterContextMenuClose(){
    this.enableContextItem = false;
  }

}
