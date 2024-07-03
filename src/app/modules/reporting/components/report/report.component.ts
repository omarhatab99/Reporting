import { Component, ComponentFactoryResolver, DoCheck, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import Swal from 'sweetalert2';
import { AddTextAreaComponent } from '../add-text-area/add-text-area.component';
import { DialogService } from 'primeng-lts/dynamicdialog';
import { TextEditorDialogComponent } from 'src/app/dialogs/text-editor-dialog/text-editor-dialog.component';
import { ReportService } from '../../services/report.service';
import { IReport } from '../../iterfaces/ireport';
import { AddFilterComponent } from '../add-filter/add-filter.component';
import { ConfirmationService } from 'primeng-lts/api';
import { chartsConfiguration } from 'src/app/shared/components/chart/chartsConfiguration';

export interface IHeader {
  padding: any,
  height: any
}

export interface IContent {
  padding: any,
  height: any
}

export interface IBorder {
  radius: any,
  color: any,
  size: any
}

export interface ITable {
  width: any,
  padding: any
}



@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DialogService],
})



export class ReportComponent implements OnInit {
  // @ViewChildren("itemElement") private itemElements: QueryList<ElementRef>;
  @ViewChild('componentContainer', { read: ViewContainerRef }) elementsContainer!: ViewContainerRef;
  @ViewChild('filterContainer', { read: ViewContainerRef }) filterContainer!: ViewContainerRef;

  //sidenav expanded toggle
  chartConfig: chartsConfiguration = new chartsConfiguration(false, "bar")
  showFiller = false;
  header: IHeader = {} as IHeader;
  content: IContent = {} as IContent;
  border: IBorder = {} as IBorder;
  table: ITable = {} as ITable;
  alignStyle: string = "right";
  isItalic: boolean;
  isUndeline: boolean;
  isBold: boolean;
  reports: any[];
  cols: any[];
  _selectedColumns: any[];
  newReport: boolean;
  displayDialog: boolean;
  report: any;
  selectedReport: any;
  filterColumns: [] = [];
  filterOperationShow: boolean = false;
  selectedOperation;
  //constructor
  constructor(private _ComponentFactoryResolver: ComponentFactoryResolver, private confirmationService: ConfirmationService) {
    this.chartConfig.ChartData.datasets = [
      {
        label: "first",
        backgroundColor: this.chartConfig.GetArrayRandomColor(5),
        borderColor: this.chartConfig.GetArrayRandomColor(5),
        borderAlign: "center",
        data: [5, 6, 10, 99, 5]
      },
      {
        label: "2111",
        backgroundColor: this.chartConfig.GetArrayRandomColor(5),
        borderColor: this.chartConfig.GetArrayRandomColor(5),
        borderAlign: "center",
        data: [22, 6, 10, 99, 5]
      }
    ]
    this.chartConfig.ChartData.labels = ["samy", "ahmed", "mohamed", "eslam", "samy"]
    this.chartConfig.type="doughnut"
  }

  createNewFilter() {
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddFilterComponent);
    const filterComponent = this.filterContainer.createComponent(componentFactory).instance;
    filterComponent.reports = this.reports;
  }

  //onInit
  ngOnInit(): void {

    console.log(this.filterColumns);
    //defaults value 
    this.content.padding = 20;
    this.header.height = 80;
    this.content.height = 500;
    this.border.size = "1";
    this.table.width = 100;
    this.table.padding = 10;

    this.reports = [{ id: 1, date: "2013-6-23", username: "mohamed hatab" }, { id: 2, date: "2013-6-23", username: "omar hatab" }]

    const keys = Object.keys(this.reports[0]);
    this.cols = keys.map((element) => { return { field: element, header: element } });
    this.cols.reverse();

    this._selectedColumns = this.cols;
    console.log(this._selectedColumns);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));

  }




  async createElement() {
    // let dynamicComponent=await this.renderComponent(`<p>samy</p><p>{{name}}</p>`)
    // dynamicComponent.name="samy"
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddTextAreaComponent);
    this.elementsContainer.createComponent(componentFactory);
  }






  changeAlign(alignValue: string) {
    this.alignStyle = alignValue;
  }

  selectItalic() {
    this.isItalic = !this.isItalic;
  }

  selectUndeline() {
    this.isUndeline = !this.isUndeline;
  }

  selectBold() {
    this.isBold = !this.isBold;
  }

}
