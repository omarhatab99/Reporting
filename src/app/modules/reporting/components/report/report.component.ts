import { Component, ComponentFactoryResolver, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DialogService } from 'primeng-lts/dynamicdialog';
import { ReportService } from '../../services/report.service';
import { chartsConfiguration } from 'src/app/shared/components/chart/chartsConfiguration';
import { AddImageComponent } from '../add-image/add-image.component';
import { DomSanitizer } from '@angular/platform-browser';
import { TableComponent } from '../table/table.component';
import { NgxPrinterService } from 'ngx-printer';
import { chartsComponent } from 'src/app/shared/components/chart/chart.Component';
import { IHeader } from '../../iterfaces/iheader';
import { IContent } from '../../iterfaces/icontent';
import { IBorder } from '../../iterfaces/iborder';
import { operationsFunction } from '../../enums/operation-function.enum';
import { barDisplayedWay } from '../../enums/bar-displayed-wau.enum';
import { TextAreaComponent } from '../text-area/text-area.component';





@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DialogService],
})
export class ReportComponent implements OnInit {
  //containerRef to add dynamic component in report.
  @ViewChild('componentContainer', { read: ViewContainerRef }) elementsContainer!: ViewContainerRef;
  //selected image preview in dialog
  @ViewChild("priview") priview: ElementRef;
  //selected image input in dialog
  @ViewChild("selectedImageInput") selectedImageInput: ElementRef;
  //sidenav expanded toggle

  //prepare default configuration for chart which will be default in report
  chartConfig: chartsConfiguration = new chartsConfiguration(false, "doughnut");
  //used for sidenav toggle
  showFiller = false;
  //objects from report content
  header: IHeader = {} as IHeader;
  content: IContent = {} as IContent;
  border: IBorder = {} as IBorder;

  //array of data used for reports
  reports: any[];
  cols: any[];
  //all columns in table but handling to used for p dropdown
  columnsOperations: any;
  displayDialogAddImage: boolean = false;
  imageSrc: any = "assets/placeholder_image.png";

  //header template used for table template reference.
  headerTemplate: TemplateRef<any>[] = [];

  //default date for printing report
  dateNow: any;

  //charts dialog
  displayDialogAddCharts: boolean = false;
  isActiveChart: string = "";
  _selectedLabelChartColumn: any = null;
  operations: any;
  selectedOperationChartColumn: any = null;
  selectedLabelChartColumnForOperation: any = null;
  barChartsDisplayWayOptions: any;
  barChartsDisplayWay: any = null;
  //constructor
  constructor(private _ComponentFactoryResolver: ComponentFactoryResolver, private sanitizer: DomSanitizer, private printerService: NgxPrinterService, private _ReportService: ReportService) { }



  //onInit
  ngOnInit(): void {

    //defaults value 
    this.content.padding = 20;
    this.header.height = 80;
    this.content.height = 500;
    this.border.size = "1";
    //dateNow -- default date for report
    this.dateNow = new Date();

    //get all reports api 
    this._ReportService.GetAllReports().subscribe((observer) => {
      this.reports = observer;

      //handle columns for table to be dynamic
      const keys = Object.keys(this.reports[0]);
      this.cols = keys.map((element) => { return { field: element, header: element } });

      //hadle direction rtl for table
      this.cols.reverse();
      //charts displayed columns options mapping
      this.columnsOperations = this.cols.map((column) => {
        return { label: column.field, value: column.field }
      });
      this.columnsOperations.unshift({ label: 'اختر عامود', value: null });
    });


    //charts operation dropdown options
    this.operations = [
      { label: 'اختار عمليه', value: null },
      { label: 'العدد', value: operationsFunction.COUNT },
      { label: 'المجموع', value: operationsFunction.SUMMITION },
      { label: 'المعدل', value: operationsFunction.AVERAGE },
    ];

    this.barChartsDisplayWayOptions = [
      { label: "اختار طريقه", value: null },
      { label: "الطريقه الولى", value: barDisplayedWay.WAY1 },
      { label: "الطريقه الثانيه", value: barDisplayedWay.WAY2 }
    ]

  }



  //this function used for send templateRef from component to another component.
  showHeaderTemplate(templateRef: TemplateRef<any>) {
    this.headerTemplate.push(templateRef);
  }


  //create text box
  createTextBox() {
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(TextAreaComponent);
    const textComponent =  this.elementsContainer.createComponent(componentFactory);
    textComponent.instance.addingMode = true;
  }

  //create table
  createTable() {

    console.log(this.cols);
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(TableComponent);
    const table = this.elementsContainer.createComponent(componentFactory);
    table.instance.reports = this.reports;
    table.instance.cols = this.cols;
    table.instance._selectedColumns = this.cols;
  }


  //all function for image

  //show dialog for image
  showDialogAddImage() {
    this.displayDialogAddImage = true;
    this.selectedImageInput.nativeElement.value = "";
  }


  //select image event run in all select image
  selectedImage(event: any) {
    const urlSrc = URL.createObjectURL(event.target.files[0]);
    this.imageSrc = urlSrc;
    let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlSrc);
    this.imageSrc = sanitizedUrl;
  }

  //close image dialog
  closeImageDialog() {
    this.displayDialogAddImage = false;
    this.imageSrc = "assets/placeholder_image.png";
    this.selectedImageInput.nativeElement.value = "";
  }

  //hide image dialog
  dialogAddImageHide() {
    this.imageSrc = "assets/placeholder_image.png";
    this.selectedImageInput.nativeElement.value = "";
  }

  //create image
  createImage() {

    if (this.selectedImageInput.nativeElement.value) {
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddImageComponent);
      const addImageComponent = this.elementsContainer.createComponent(componentFactory);
      addImageComponent.instance.imageSrc = this.imageSrc;
      this.displayDialogAddImage = false;
    }


  }

  //all function for charts

  //show dialog add chart
  showAddChartDialog() {
    this.displayDialogAddCharts = true;
  }

  //hide dialog addChart
  closeChartDialog() {
    this.displayDialogAddCharts = false;
  }

  //select chart type
  selectedCharts(chartName: string) {
    this.isActiveChart = chartName;
  }

  get selectedLabelChartColumn() {
    return this._selectedLabelChartColumn;
  }

  set selectedLabelChartColumn(val: any) {
    this._selectedLabelChartColumn = val;
  }


  //create chart
  createChart() {

    switch (this.isActiveChart) {
      case "doughnut"://in case chart is doughnut
        this.addDoughnutChart();
        break;
      default: //in case chart is doughnut
        this.addBarChart();
        break;
    }

  }

  //add doughnut chart
  addDoughnutChart(): void {
    if (this.selectedLabelChartColumn) {

      //get data for selected column 
      const dataForColumn = this.reports.map((element) => { return element[this.selectedLabelChartColumn] });
      //get distinct data from dataForColumn.
      const distinctDataForColumn = [...new Set(dataForColumn)];
      //conver distinct data to string
      const distinctLabel = distinctDataForColumn.map((element) => element.toString());
      let data = [];
      //check if user select operation not count
      if ((this.selectedOperationChartColumn != operationsFunction.COUNT && this.selectedLabelChartColumnForOperation != null) || this.selectedOperationChartColumn == operationsFunction.COUNT) {

        switch (this.selectedOperationChartColumn) {

          case operationsFunction.SUMMITION: //in case select summition operation
            data = this.summitionChartOperation(this.reports, this.selectedLabelChartColumn, distinctLabel, this.selectedLabelChartColumnForOperation);
            break;
          case operationsFunction.AVERAGE: //in case select average operation 
            data = this.averageChartOperation(this.reports, this.selectedLabelChartColumn, distinctLabel, this.selectedLabelChartColumnForOperation);
            break;
          default: //in case select count operation
            data = this.countChartOperation(dataForColumn, distinctLabel);
            break;
        }


        //create chart

        //create component of chartsComponent
        const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(chartsComponent);
        const chartComponent = this.elementsContainer.createComponent(componentFactory);

        //pass chartConfig
        const chartConfig: chartsConfiguration = new chartsConfiguration(false, "doughnut");
        chartConfig.ChartData.labels = distinctLabel
        chartConfig.type = 'doughnut';
        chartConfig.ChartData.datasets = [{
          label: 'My First Dataset',
          data: data,
          backgroundColor: this.chartConfig.GetArrayRandomColor(chartConfig.ChartData.labels.length),
          hoverOffset: 4,
        }];

        //create object have all settings
        let chartSettings: any = {
          selectedLabelChartColumn: this.selectedLabelChartColumn,
          selectedOperationChartColumn: this.selectedOperationChartColumn,
          selectedLabelChartColumnForOperation: this.selectedLabelChartColumnForOperation,
          columnsOperations: this.columnsOperations,
          operations: this.operations,
          barChartsDisplayWayOptions: this.barChartsDisplayWayOptions,
          barChartsDisplayWay: this.barChartsDisplayWay,
          chartConfing: chartConfig,
          reports: this.reports
        };

        chartComponent.instance.chartsConfig = chartConfig;
        chartComponent.instance.chartSettings = chartSettings;

        this.displayDialogAddCharts = false;
      }
    }
  }

  //add bar chart
  addBarChart(): void {
    if (this.selectedLabelChartColumn) {

      //get data for selected column 
      const dataForColumn = this.reports.map((element) => { return element[this.selectedLabelChartColumn] });
      //get distinct data from dataForColumn.
      const distinctDataForColumn = [...new Set(dataForColumn)];
      //conver distinct data to string
      const distinctLabel = distinctDataForColumn.map((element) => element.toString());
      let data = [];
      //check if user select operation not count
      if ((this.selectedOperationChartColumn != operationsFunction.COUNT && this.selectedLabelChartColumnForOperation != null) || this.selectedOperationChartColumn == operationsFunction.COUNT) {

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
        const chartConfig: chartsConfiguration = new chartsConfiguration(true, "bar");
        chartConfig.ChartData.labels = distinctLabel
        chartConfig.type = 'bar';
        chartConfig.ChartData.datasets = [{
          label: '',
          data: data,
          backgroundColor: this.chartConfig.GetArrayRandomColor(chartConfig.ChartData.labels.length),
          hoverOffset: 4,
        }];

        chartComponent.instance.height = 8;
        chartComponent.instance.width = 18;
        //create object have all settings
        let chartSettings: any = {
          selectedLabelChartColumn: this.selectedLabelChartColumn,
          selectedOperationChartColumn: this.selectedOperationChartColumn,
          selectedLabelChartColumnForOperation: this.selectedLabelChartColumnForOperation,
          columnsOperations: this.columnsOperations,
          operations: this.operations,
          barChartsDisplayWayOptions: this.barChartsDisplayWayOptions,
          barChartsDisplayWay: this.barChartsDisplayWay,
          chartConfing: chartConfig,
          reports: this.reports
        };

        chartComponent.instance.chartsConfig = chartConfig;
        chartComponent.instance.chartSettings = chartSettings;
        this.displayDialogAddCharts = false;
      }



    }
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
