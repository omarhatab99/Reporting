import { Chart, ChartType, registerables } from 'chart.js'
import { chartsConfiguration } from "./chartsConfiguration";
import { AfterContentChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ConfirmationService } from 'primeng-lts/api';
import { operationsFunction } from 'src/app/modules/reporting/enums/operation-function.enum';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addchartComponent',
  templateUrl: './add-chart.Component.html',
  styleUrls: ['./add-chart.Component.css'],

})
export class addChartComponent implements AfterContentChecked, AfterViewInit, OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('container', { static: false }) container: ElementRef;
  @ViewChild("chartContainer") chartContainer: ElementRef;
  @ViewChild("chartMenu") chartMenu: ContextMenuComponent;

  @Input() height: number = 30;
  @Input() width: number = 70;

  @Input() typeSelect: ChartType = null;
  StringType: boolean = false;

  @ViewChild('containerBox', { static: false }) containerBox: ElementRef;
  @Input() chartsConfig: any = new chartsConfiguration();
  listChartDynamic: Array<chartsConfiguration> = [];
  displayDialogAddCharts: boolean = false;
  @Input() chartSettings: any = {};
  cols: any[];

  isFlyingElement: boolean = false;
  currentChartWidth:any;
  currentChartHeight:any;
  currentTransform:any;
  //to reset drag transform (fixed issue)
  dragPosition:any= {x: 0, y: 0};
  constructor(private toasterService: ToastrService , private confirmationService: ConfirmationService , private contextMenuService: ContextMenuService) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    if (typeof this.chartsConfig == "string") {
      this.listChartDynamic = [];
      this.StringType = true;
      let objectConvertArray = JSON.parse(this.chartsConfig) as Array<any>;
      let objectConvertArraySelected = [];
      if (this.typeSelect != null) {
        objectConvertArraySelected = objectConvertArray.filter(x => x.Type == this.typeSelect);
      }
      else {
        objectConvertArraySelected = objectConvertArray;
      }

      objectConvertArraySelected.forEach((chartDynamic) => {
        if (chartDynamic.Direction == '') chartDynamic.Direction = "vertical"
        let showHeader = false
        let dataSets = chartDynamic.Datasets as Array<any>;
        if (dataSets.length > 1) {
          showHeader = true;
        }
        let configDynamic: chartsConfiguration = new chartsConfiguration(showHeader, chartDynamic.Type, chartDynamic.Direction);
        configDynamic.ChartData.labels = chartDynamic.Labels.split(',')
        configDynamic.ChartData.datasets = [];
        dataSets.forEach(dataSit => {
          configDynamic.ChartData.datasets.push({
            data: dataSit.data,
            label: dataSit.label,
            backgroundColor: configDynamic.GetArrayRandomColor(configDynamic.ChartData.labels.length)
          })
        })

        let setterProperly = configDynamic as any;
        setterProperly._ColumnWidth = chartDynamic.ColumnWidth as number
        setterProperly._Height = chartDynamic.ColumnHeight as number
        this.listChartDynamic.push(configDynamic)
      })
      this.chartsConfig = 0;
    }
  }

  ngAfterViewInit(): void {

    this.currentChartWidth = getComputedStyle(this.chartContainer.nativeElement).getPropertyValue('width');
    this.currentChartHeight = getComputedStyle(this.chartContainer.nativeElement).getPropertyValue('height');

    if (this.canvas != undefined) {
      this.chartsConfig = this.chartsConfig as chartsConfiguration;
      if (Chart.getChart(this.canvas.nativeElement) == undefined) {
        Chart.register(...registerables)
        let myChart = new Chart(this.canvas.nativeElement, {
          type: this.chartsConfig.type,
          data: this.chartsConfig.ChartData,
          options: this.chartsConfig.ChartOptions,
          plugins: this.chartsConfig.ChartPlugin,
        })
        this.chartsConfig.ChartCreated = myChart;
      }
      this.canvas.nativeElement.style.width = "100%"
      if (this.chartsConfig.type == "bar" || this.chartsConfig.type == "line") {

        let length = this.chartsConfig.ChartData.labels.length;
        if (length > 15) {
          if (this.chartsConfig.direction == "vertical") {
            const newWidth = 700 + (length * this.width);
            this.containerBox.nativeElement.style.width = newWidth + 'px'
          }
        }
      }
    }
  }


  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.chartMenu,
      event: $event,
      item: item,
    });
    console.log("hello");
    console.log($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }


  makeElementFly(element: any) {

    this.isFlyingElement = !this.isFlyingElement;
    if (this.isFlyingElement) {
      element.style.position = "absolute";
      this.chartContainer.nativeElement.style.inset = "unset";
    }
    else {

      this.chartContainer.nativeElement.style.margin = "0px 0px 0px 0px";
      this.chartContainer.nativeElement.style.marginLeft = "0px";
      this.chartContainer.nativeElement.style.marginBottom = "0px";
      this.chartContainer.nativeElement.style.marginTop = "0px";
      this.chartContainer.nativeElement.style.marginRight = "0px";
      this.chartContainer.nativeElement.style.left = "0px";
      this.chartContainer.nativeElement.style.bottom = "0px";
      this.chartContainer.nativeElement.style.top = "0px";
      this.chartContainer.nativeElement.style.right = "0px";
      element.style.position = "relative";

    }

  }

  resetElement(element:any){

    //reset drag position
    this.dragPosition = {x: 0, y: 0};
    this.isFlyingElement = false;
    this.chartContainer.nativeElement.style.width = this.currentChartWidth;
    this.chartContainer.nativeElement.style.height = 'auto';
    this.chartContainer.nativeElement.style.margin = "0px 0px 0px 0px";
    this.chartContainer.nativeElement.style.marginLeft = "0px";
    this.chartContainer.nativeElement.style.marginBottom = "0px";
    this.chartContainer.nativeElement.style.marginTop = "0px";
    this.chartContainer.nativeElement.style.marginRight = "0px";
    element.style.position = "relative";

  }




  get selectedLabelChartColumn() {
    return this.chartSettings.selectedLabelChartColumn;
  }

  set selectedLabelChartColumn(val: any) {
    this.chartSettings.selectedLabelChartColumn = val;
  }



  confirmationDeleteChart() {
    this.confirmationService.confirm({
      message: 'هل انت متاكد من حذف العنصر لن تكون قادر على استعادته',
      accept: () => {
        //Actual logic to perform a confirmation
        this.chartContainer.nativeElement.remove();
      }
    });
  }


  closeChartDialog() {
    this.displayDialogAddCharts = false;
  }

  showDialogAddChart() {
    this.displayDialogAddCharts = true;
  }

  editChart() {

    //in case chart is doughnut
    if (this.chartsConfig.type == "doughnut") {

      if (this.selectedLabelChartColumn) {
        console.log(this.selectedLabelChartColumn);
        //get data for selected column 
        const dataForColumn = this.chartSettings.reports.map((element) => { return element[this.selectedLabelChartColumn] });
        //get distinct data from dataForColumn.
        const distinctDataForColumn = [...new Set(dataForColumn)];
        //conver distinct data to string
        const distinctLabel = distinctDataForColumn.map((element) => element.toString());
        let data = [];
        //check if user select operation not count
        if ((this.chartSettings.selectedOperationChartColumn != operationsFunction.COUNT && this.chartSettings.selectedLabelChartColumnForOperation != null) || this.chartSettings.selectedOperationChartColumn == operationsFunction.COUNT) {

          switch (this.chartSettings.selectedOperationChartColumn) {

            case operationsFunction.SUMMITION:
              data = this.summitionChartOperation(this.chartSettings.reports, this.selectedLabelChartColumn, distinctLabel, this.chartSettings.selectedLabelChartColumnForOperation);
              break;
            case operationsFunction.AVERAGE:
              data = this.averageChartOperation(this.chartSettings.reports, this.selectedLabelChartColumn, distinctLabel, this.chartSettings.selectedLabelChartColumnForOperation);
              break;
            default:
              data = this.countChartOperation(dataForColumn, distinctLabel);
              break;
          }


          //edit chart

          //pass chartConfig
          this.chartsConfig.ChartData.labels = distinctLabel
          this.chartsConfig.type = 'doughnut';
          this.chartsConfig.ChartData.datasets = [{
            label: 'My First Dataset',
            data: data,
            backgroundColor: this.chartsConfig.GetArrayRandomColor(this.chartsConfig.ChartData.labels.length),
            hoverOffset: 4,
          }];

          this.chartsConfig.resetData()

          this.displayDialogAddCharts = false;
        }
        else
        {
          this.toasterService.warning('يجب تحديد المدخلات اولا', 'تحذير');
        }
      }
      else
      {
        this.toasterService.warning('يجب تحديد المدخلات اولا', 'تحذير');
      }
    }

    //in case chart is bar
    if (this.chartsConfig.type == "bar") {

      if (this.selectedLabelChartColumn) {
        console.log(this.selectedLabelChartColumn);
        //get data for selected column 
        const dataForColumn = this.chartSettings.reports.map((element) => { return element[this.selectedLabelChartColumn] });
        //get distinct data from dataForColumn.
        const distinctDataForColumn = [...new Set(dataForColumn)];
        //conver distinct data to string
        const distinctLabel = distinctDataForColumn.map((element) => element.toString());
        console.log(distinctLabel);
        let data = [];
        //check if user select operation not count
        if ((this.chartSettings.selectedOperationChartColumn != operationsFunction.COUNT && this.chartSettings.selectedLabelChartColumnForOperation != null) || this.chartSettings.selectedOperationChartColumn == operationsFunction.COUNT) {

          switch (this.chartSettings.selectedOperationChartColumn) {

            case operationsFunction.SUMMITION:
              data = this.summitionChartOperation(this.chartSettings.reports, this.selectedLabelChartColumn, distinctLabel, this.chartSettings.selectedLabelChartColumnForOperation);
              break;
            case operationsFunction.AVERAGE:
              data = this.averageChartOperation(this.chartSettings.reports, this.selectedLabelChartColumn, distinctLabel, this.chartSettings.selectedLabelChartColumnForOperation);
              break;
            default:
              data = this.countChartOperation(dataForColumn, distinctLabel);
              break;
          }


          //edit chart

          //pass chartConfig
          this.chartsConfig.ChartData.labels = distinctLabel
          this.chartsConfig.type = 'bar';
          this.chartsConfig.ChartData.datasets = [{
            label: '',
            data: data,
            backgroundColor: this.chartsConfig.GetArrayRandomColor(this.chartsConfig.ChartData.labels.length),
            hoverOffset: 4,
          }];

          this.chartsConfig.resetData()

          this.displayDialogAddCharts = false;
        }
        else
        {
          this.toasterService.warning('يجب تحديد المدخلات اولا', 'تحذير');
        }
      }
      else
      {
        this.toasterService.warning('يجب تحديد المدخلات اولا', 'تحذير');
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
