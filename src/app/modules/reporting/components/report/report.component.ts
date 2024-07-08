import { AfterViewInit, Component, ComponentFactoryResolver, DoCheck, ElementRef, Input, OnInit, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import Swal from 'sweetalert2';
import { AddTextAreaComponent } from '../add-text-area/add-text-area.component';
import { DialogService } from 'primeng-lts/dynamicdialog';
import { TextEditorDialogComponent } from 'src/app/dialogs/text-editor-dialog/text-editor-dialog.component';
import { ReportService } from '../../services/report.service';
import { IReport } from '../../iterfaces/ireport';
import { AddFilterComponent } from '../add-filter/add-filter.component';
import { ConfirmationService } from 'primeng-lts/api';
import { chartsConfiguration } from 'src/app/shared/components/chart/chartsConfiguration';
import { AddImageComponent } from '../add-image/add-image.component';
import { DomSanitizer } from '@angular/platform-browser';
import { TableComponent } from '../table/table.component';
import { NgxPrinterService } from 'ngx-printer';
import { chartsComponent } from 'src/app/shared/components/chart/chart.Component';


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

export enum operationsFunction {
  SUMMITION,
  AVERAGE,
  BIGGEST,
  SMALLEST,
  COUNT
};



@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DialogService],
})



export class ReportComponent implements OnInit {
  // @ViewChildren("itemElement") private itemElements: QueryList<ElementRef>;
  @ViewChild('componentContainer', { read: ViewContainerRef }) elementsContainer!: ViewContainerRef;
  @ViewChild("priview") priview: ElementRef;
  @ViewChild("selectedImageInput") selectedImageInput: ElementRef;
  //sidenav expanded toggle
  chartConfig: chartsConfiguration = new chartsConfiguration(false, "bar")
  showFiller = false;
  header: IHeader = {} as IHeader;
  content: IContent = {} as IContent;
  border: IBorder = {} as IBorder;
  alignStyle: string = "right";
  isItalic: boolean;
  isUndeline: boolean;
  isBold: boolean;
  reports: any[];
  cols: any[];
  newReport: boolean;
  displayDialog: boolean;
  report: any;
  displayDialogAddImage: boolean = false;
  imageSrc: any = "assets/placeholder_image.png";
  headerTemplate: TemplateRef<any>[] = [];
  tableNumber: number = 1;
  dateNow: any;
  selectedImagePosition: any = "content";
  displayDialogAddCharts: boolean = false;
  isActiveChart: string = "";
  _selectedLabelChartColumn: any = null;
  columnsOperations: any;
  operations: any;
  selectedOperationChartColumn: any = null;
  selectedLabelChartColumnForOperation: any = null;
  //constructor
  constructor(private _ComponentFactoryResolver: ComponentFactoryResolver, private confirmationService: ConfirmationService, private sanitizer: DomSanitizer, private printerService: NgxPrinterService, private _ReportService: ReportService) {
    this.chartConfig.ChartData.labels = ["samy", "ahmed", "mohamed"]
    this.chartConfig.type = "doughnut";
    this.chartConfig.ChartData.datasets = [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: this.chartConfig.GetArrayRandomColor(this.chartConfig.ChartData.labels.length),
      hoverOffset: 4,

    },

    ]


  }


  showHeaderTemplate(templateRef: TemplateRef<any>) {
    this.headerTemplate.push(templateRef);
    console.log(this.headerTemplate);

  }

  showDialogAddImage() {
    this.displayDialogAddImage = true;
    this.selectedImageInput.nativeElement.value = "";
  }

  selectedImage(event: any) {
    const urlSrc = URL.createObjectURL(event.target.files[0]);
    this.imageSrc = urlSrc;
    console.log(this.imageSrc);
    let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlSrc);
    this.imageSrc = sanitizedUrl;

  }


  closeImageDialog() {
    this.displayDialogAddImage = false;
    this.imageSrc = "assets/placeholder_image.png";
    this.selectedImageInput.nativeElement.value = "";
  }

  dialogAddImageHide() {
    this.imageSrc = "assets/placeholder_image.png";
    this.selectedImageInput.nativeElement.value = "";
  }

  createImage() {

    if (this.selectedImageInput.nativeElement.value) {
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddImageComponent);
      const addImageComponent = this.elementsContainer.createComponent(componentFactory);
      addImageComponent.instance.imageSrc = this.imageSrc;
      this.displayDialogAddImage = false;
    }


  }

  closeChartDialog() {
    this.displayDialogAddCharts = false;
  }

  showDialogAddChart() {
    this.displayDialogAddCharts = true;
  }

  createChart() {

    if (this.selectedLabelChartColumn) {

      //get data for selected column 
      const dataForColumn = this.reports.map((element) => { return element[this.selectedLabelChartColumn] });
      //get distinct data from dataForColumn.
      const distinctDataForColumn = [...new Set(dataForColumn)];
      //conver distinct data to string
      const distinctLabel = distinctDataForColumn.map((element) => element.toString());
      let data = [];
      //check if user select operation not count
      if (this.selectedOperationChartColumn != operationsFunction.COUNT && this.selectedLabelChartColumnForOperation != null) {

        switch (this.selectedOperationChartColumn) {

          case operationsFunction.SUMMITION:
            data = this.summitionChartOperation(this.reports, this.selectedLabelChartColumn, distinctLabel, this.selectedLabelChartColumnForOperation);
            break;
          case operationsFunction.AVERAGE:
            data = this.averageChartOperation(this.reports, this.selectedLabelChartColumn, distinctLabel, this.selectedLabelChartColumnForOperation);
            break;
          default:
            data = this.countChartOperation(dataForColumn, distinctLabel);
            break;
        }


        //create chart

        //create component of chartsComponent
        const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(chartsComponent);
        const chartComponent = this.elementsContainer.createComponent(componentFactory);

        //pass chartConfig
        const chartConfig: chartsConfiguration = new chartsConfiguration(false, "bar");
        chartConfig.ChartData.labels = distinctLabel
        chartConfig.type = 'doughnut';
        chartConfig.ChartData.datasets = [{
          label: 'My First Dataset',
          data: data,
          backgroundColor: this.chartConfig.GetArrayRandomColor(chartConfig.ChartData.labels.length),
          hoverOffset: 4,
        }];

        chartComponent.instance.chartsConfig = chartConfig;

        this.displayDialogAddCharts = false;
      }
      else {

      }
    }

  }

  selectedCharts(chartName: string) {
    this.isActiveChart = chartName;
  }

  //onInit
  ngOnInit(): void {

    //defaults value 
    this.content.padding = 20;
    this.header.height = 80;
    this.content.height = 500;
    this.border.size = "1";

    this.dateNow = new Date();

    this._ReportService.GetAllReports().subscribe((observer) => {
      this.reports = observer;
      const keys = Object.keys(this.reports[0]);
      this.cols = keys.map((element) => { return { field: element, header: element } });
      this.cols.reverse();
      //charts displayed columns options mapping
      this.columnsOperations = this.cols.map((column) => {
        return { label: column.field, value: column.field }
      });

      this.columnsOperations.unshift({ label: 'اختر عامود', value: null });
    });


    //charts operation dropdown options
    this.operations = [
      {label: 'اختار عمليه' , value: null},
      { label: 'العدد', value: operationsFunction.COUNT },
      { label: 'المجموع', value: operationsFunction.SUMMITION },
      { label: 'المعدل', value: operationsFunction.AVERAGE },
    ];


  }



  get selectedLabelChartColumn() {
    return this._selectedLabelChartColumn;
  }

  set selectedLabelChartColumn(val: any) {
    this._selectedLabelChartColumn = val;
  }





  createTextBox() {
    // let dynamicComponent=await this.renderComponent(`<p>samy</p><p>{{name}}</p>`)
    // dynamicComponent.name="samy"
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddTextAreaComponent);
    this.elementsContainer.createComponent(componentFactory);
  }

  createTable() {

    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(TableComponent);
    const table = this.elementsContainer.createComponent(componentFactory);
    table.instance.reports = this.reports;
    table.instance.cols = this.cols;

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


  //this function return summition for donout chart
  summitionChartOperation(reports: any[], selectedChartColumn: any, distinctArray: any[], selectedLabelChartColumnForOperation: any): any[] {
    const summitionArray: any[] = [];
    distinctArray.forEach((element) => {
      const summitionFilter = reports.filter((row) => row[selectedChartColumn] == element)
        .map((row) => row[selectedLabelChartColumnForOperation])
        .reduce((current, accumalator) => parseFloat(current) + parseFloat(accumalator));
      summitionArray.push(summitionFilter);
    });

    return summitionArray;
  }


  //this function return summition for donout chart
  averageChartOperation(reports: any[], selectedChartColumn: any, distinctArray: any[], selectedLabelChartColumnForOperation: any): any[] {
    const averageArray: any[] = [];
    distinctArray.forEach((element) => {

      const averageFilter = reports.filter((row) => row[selectedChartColumn] == element)
        .map((row) => row[selectedLabelChartColumnForOperation]);

      const sumOfData = averageFilter.reduce((current, accumalator) => parseFloat(current) + parseFloat(accumalator));

      const average = sumOfData / averageFilter.length;

      averageArray.push(average);
    });

    return averageArray;
  }


  //this function return summition for donout chart
  countChartOperation(dataForColumn: any[], distinctArray: any[]): any[] {
    const countArray: any[] = [];
    distinctArray.forEach((label) => {
      const countFilter = dataForColumn.filter((element) => element == label);
      countArray.push(countFilter.length);
    });

    return countArray;
  }

}
