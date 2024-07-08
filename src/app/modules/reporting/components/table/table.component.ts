import { AfterViewInit, Component, ComponentFactoryResolver, DoCheck, ElementRef, Input, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ReportComponent } from '../report/report.component';
import { AddFilterComponent } from '../add-filter/add-filter.component';
import { ConfirmationService } from 'primeng-lts/api';
import { FunctionComponent } from '../function/function.component';
import { BehaviorSubject } from 'rxjs';
import { ITable } from '../../iterfaces/itable';


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
  //inputs
  @Input() reports: any[] = [];
  @Input() cols: any[] = [];

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

  constructor(private reportComponent: ReportComponent, private _ComponentFactoryResolver: ComponentFactoryResolver, private confirmationService: ConfirmationService ) { }

  //fire when inputs is changed
  ngOnChanges(changes: SimpleChanges): void {
    this._selectedColumns = this.cols;
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


  //delete text box element
  confirmationDeleteTable(event: any) {
    this.confirmationService.confirm({
      message: 'هل انت متاكد من حذف العنصر لن تكون قادر على استعادته',
      accept: () => {
        //Actual logic to perform a confirmation
        this.dataSourceTable.nativeElement.remove();
        //const index = this.reportComponent.headerTemplate.findIndex((element) => element == this.settingsTmpl);
        const tableIndex = TableComponent.tableStatic.findIndex((compnent) => compnent == this);
        TableComponent.tableStatic.splice(tableIndex, 1);
        this.reportComponent.headerTemplate.splice(tableIndex, 1);
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
    this.exportColumns = this.selectedColumns.map(col => ({ title: col.header, dataKey: col.field }));
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.reports, {
          margin: { horizontal: 0, top: 5 },
          styles: { overflow: 'linebreak' },
        });
        doc.save('primengTable.pdf');
      });
    });


  }


//export excel
  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.reports);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
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


}
