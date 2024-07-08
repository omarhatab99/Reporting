import { AfterViewInit, Component, ComponentFactoryResolver, DoCheck, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ReportComponent } from '../report/report.component';
import { AddFilterComponent } from '../add-filter/add-filter.component';
import { ConfirmationService } from 'primeng-lts/api';
import { CarsService } from '../../services/cars.service';
import { AggregateComponent } from '../aggregate/aggregate.component';
import { FunctionComponent } from '../function/function.component';
import { ReportService } from '../../services/report.service';
import { BehaviorSubject } from 'rxjs';

export interface ITable {
  width: any,
  padding: any,
  title:any,
  thFontSize:any,
  tdFontSize:any
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit , DoCheck , AfterViewInit{
@Input() reports:any[];
@Input() cols:any[]; 
width:any;
cellPadding:any;
table: ITable = {} as ITable;
newReport: boolean;
displayDialog: boolean = false;
report:any = {};
selectedReport: any;
selectedReports: any[];
exportColumns: any[];
AddDialog:boolean = false;;
_selectedColumns: any[];
settingsId:any;
@ViewChild("tableFooter" , { read: ViewContainerRef }) tableFooter:ViewContainerRef;
@ViewChild('filterContainer', { read: ViewContainerRef }) filterContainer!: ViewContainerRef;
@ViewChild('functionContainer', { read: ViewContainerRef }) functionContainer!: ViewContainerRef;

@ViewChild("dataSourceTable") dataSourceTable:ElementRef;
@ViewChild("settings") settingsTmpl: TemplateRef<any>;
static tableStatic:TableComponent[] = [];
tableNumber:number;
isNumber:boolean;
functionSelected:any[] = [];
isReportsChanged:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private reportComponent:ReportComponent , private _ComponentFactoryResolver: ComponentFactoryResolver, private confirmationService:ConfirmationService , private _ReportService:ReportService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    this._selectedColumns =this.cols;
  }
  
  ngDoCheck(): void {
    this.tableNumber = TableComponent.tableStatic.findIndex((component) => component == this) + 1;
  }

  ngOnInit(): void {
    this.settingsId = this.getRandomId();
    this.table.width = 100;
    this.table.padding = 10;
    this.table.title = "";
    this.table.tdFontSize = 13;
    this.table.thFontSize = 13;

    TableComponent.tableStatic.push(this);
    this.tableNumber = TableComponent.tableStatic.findIndex((component) => component == this) + 1;

    //   this._ReportService.GetAllReports().subscribe((observer) => {
    //   this.myReports.next(observer);
    //   this.reports = observer;
    //   const keys = Object.keys(this.reports[0]);
    //   this.cols = keys.map((element) => { return { field: element, header: element } });
    //   this.cols.reverse();
    //   this._selectedColumns = this.cols;
    // })

    

  }


  ngAfterViewInit() {
    Promise.resolve().then(() => this.reportComponent.showHeaderTemplate(this.settingsTmpl));
    // let compoented = this._ComponentFactoryResolver.resolveComponentFactory(AggregateComponent);
    // this.tableFooter.createComponent(compoented);
  }

  showDialogToAdd() {
    this.newReport = true;
    this.report = {};
    this.AddDialog = true;
    this.displayDialog = true;
  }

  save() {
    let reports = [...this.reports];
    if (this.newReport)
        reports.push(this.report);
    else
        reports[this.reports.indexOf(this.selectedReport)] = this.report;
  
    this.reports = reports;
    this.report = null;
    this.AddDialog = false;
    this.displayDialog = false;
  }
  
  delete() {
    let index = this.reports.indexOf(this.selectedReport);
    this.reports = this.reports.filter((val, i) => i != index);
    this.report = null;
    this.displayDialog = false;
  }
  
  onRowSelect(event:any) {
    
    console.log(event);
  }
  


  isNum(colheader):boolean{
    
    if(Number.isNaN(Number(this.reports[0][colheader])))
    {
      return false;
    }
    else {
      return true;
    }
  }

    //delete text box element
    confirmationDeleteTextBox(event: any) {
      this.confirmationService.confirm({
        message: 'هل انت متاكد من حذف العنصر لن تكون قادر على استعادته',
        accept: () => {
            //Actual logic to perform a confirmation
            this.dataSourceTable.nativeElement.remove();
            //const index = this.reportComponent.headerTemplate.findIndex((element) => element == this.settingsTmpl);
            const tableIndex = TableComponent.tableStatic.findIndex((compnent) => compnent == this);
            TableComponent.tableStatic.splice(tableIndex , 1);
            this.reportComponent.headerTemplate.splice(tableIndex , 1);
          }
      });
    }

    @Input() get selectedColumns(): any[] {
      return this._selectedColumns;
    }
  
    set selectedColumns(val: any[]) {
      //restore original order
      this._selectedColumns = this.cols.filter(col => val.includes(col));
  
    }

    createNewFilter() {
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddFilterComponent);
      const filterComponent = this.filterContainer.createComponent(componentFactory).instance;
      filterComponent.reports = this.reports;
    }

    createNewFunction(){
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(FunctionComponent);
      this.functionContainer.createComponent(componentFactory).instance;
    }
    
    exportPdf() {
      this.exportColumns = this.selectedColumns.map(col => ({title: col.header, dataKey: col.field}));
      import("jspdf").then(jsPDF => {
          import("jspdf-autotable").then(x => {
              const doc = new jsPDF.default(0,0);
              doc.autoTable(this.exportColumns, this.reports , {
                margin: {horizontal:0,top: 5},
                styles: {overflow: 'linebreak'},
              });
              doc.save('primengTable.pdf');
          });
      });

      
  }



  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.reports);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "primengTable");
    });8
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
    

  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `settings-${random}`;
  }

    
}
