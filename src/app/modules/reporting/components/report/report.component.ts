import { Component, ComponentFactoryResolver, ElementRef , OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
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
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { IFooter } from '../../iterfaces/ifooter';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {NgxPrintElementService } from 'ngx-print-element';
import { IPrint } from '../../iterfaces/iprint';
import { ContextMenuComponent } from 'ngx-contextmenu';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DialogService, ToastrService],
})
export class ReportComponent implements OnInit{
  //containerRef to add dynamic component in report.
  @ViewChild('componentContainer', { read: ViewContainerRef }) elementsContainer!: ViewContainerRef;
  @ViewChild('componentHeader', { read: ViewContainerRef }) componentHeader!: ViewContainerRef;
  @ViewChild('componentFooter', { read: ViewContainerRef }) componentFooter!: ViewContainerRef;
  @ViewChild('content', { read: ElementRef }) contentReport: ElementRef;
  @ViewChild('exportPdf', { read: ElementRef }) exportPdf: ElementRef;
  @ViewChild("cardContentReport") cardContentReport:ElementRef;
  @ViewChild("cardHeaderReport") cardHeaderReport:ElementRef;
  @ViewChild("cardFooterReport") cardFooterReport:ElementRef;
  @ViewChild("basicMenu") basicMenu: ContextMenuComponent;

  //selected image preview in dialog
  @ViewChild("priview") priview: ElementRef;
  //selected image input in dialog
  @ViewChild("selectedImageInput") selectedImageInput: ElementRef;
  //sidenav expanded toggle
  //textbox
  value: string = "";
  displayDialogAddText: boolean = false;
  //prepare default configuration for chart which will be default in report
  chartConfig: chartsConfiguration = new chartsConfiguration(false, "doughnut");
  //used for sidenav toggle
  _displaySidebar = false;
  //objects from report content
  cardHeader: IHeader = {} as IHeader;
  cardContent: IContent = {} as IContent;
  border: IBorder = {} as IBorder;
  cardFooter: IFooter = {} as IFooter;
  //array of data used for reports
  reports: any[];
  cols: any[];
  //all columns in table but handling to used for p dropdown
  columnsOperations: any;
  columnsOperationsNumbers: any;
  displayDialogAddImage: boolean = false;
  imageSrc: any = "assets/placeholder_image.png";

  //header template used for table template reference.
  headerTemplate: TemplateRef<any>[] = [];

  //default date for printing report
  dateNow: any;

  //charts dialog
  displayDialogAddCharts: boolean = false;
  isActiveChart: string = "doughnut";
  _selectedLabelChartColumn: any = null;
  operations: any;
  selectedOperationChartColumn: any = null;
  selectedLabelChartColumnForOperation: any = null;
  barChartsDisplayWayOptions: any;
  barChartsDisplayWay: any = null;

  borderSizeOptions: any;
  postionOptions: any;
  postionSelected: any = "content";

  printSettings:IPrint = {} as IPrint;
  pageTypeOptions:any[] = [];
  _enableChangeDiminsion:boolean = false;
  //constructor
  constructor(private _ComponentFactoryResolver: ComponentFactoryResolver,private NgxPrintElementService: NgxPrintElementService, private sanitizer: DomSanitizer, private printerService: NgxPrinterService, private _ReportService: ReportService, private toasterService: ToastrService, private renderer: Renderer2) { }

  get enableChangeDiminsion(){
    return this._enableChangeDiminsion;
  }
  set enableChangeDiminsion(val:boolean){
    this._enableChangeDiminsion = val;

    if(val == true) {
      const contentHeightValue = getComputedStyle(this.cardContentReport.nativeElement).getPropertyValue('height');
      this.cardContent.height = parseInt(contentHeightValue);

      //--------------------------
      const headerHeightValue = getComputedStyle(this.cardHeaderReport.nativeElement).getPropertyValue('height');
      this.cardHeader.height = parseInt(headerHeightValue);

      //--------------------------
      const footerHeightValue = getComputedStyle(this.cardFooterReport.nativeElement).getPropertyValue('height');
      this.cardFooter.height = parseInt(footerHeightValue);
    }
  }

  onPrint1(el: ElementRef<HTMLTableElement>) {
    const styleLayout = document.getElementById("styleCustom");
    if(styleLayout != null){
      document.getElementById("styleCustom").remove();
    }
    const printStyle = document.createElement('style');
    printStyle.id = "styleCustom";
    printStyle.type = 'text/css';
    printStyle.media = 'print';

    // Define the print styles
    printStyle.textContent = `
            @page {
                size: A4 ${this.printSettings.layout} !important;  
                border:1px solid #555;
            }
              body {
                    zoom:${this.printSettings.zoom}% !important;
                  }
      `;

    // Append the style element to the document head
    document.head.appendChild(printStyle);

    this.NgxPrintElementService.print(el).subscribe(() => {});


  }


  //onInit
  ngOnInit(): void {


    this.printSettings.layout = "portrait";
    this.printSettings.zoom = 100;
    
    //defaults value 
    this.cardContent.padding = 20;
    this.cardHeader.height = 0;
    this.cardFooter.height = 0;
    this.cardContent.height = 0;
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

      //numbers columns
      this.columnsOperationsNumbers = this.cols.filter((numberColumn) => {
        if (!Number.isNaN(parseFloat(this.reports[0][numberColumn.field]))) {
          return numberColumn
        }
      }).map((column) => {
        return { label: column.field, value: column.field }
      });
      this.columnsOperationsNumbers.unshift({ label: 'اختر عامود', value: null }); 2
      console.log(this.columnsOperationsNumbers);
    });

    this.borderSizeOptions = [
      { label: '1px', value: 1 },
      { label: '2px', value: 2 },
      { label: '3px', value: 3 },
      { label: '4px', value: 4 },
      { label: '5px', value: 5 },
    ];

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
    ];

    this.postionOptions = [
      { label: "العنوان", value: "header" },
      { label: "المحتوى", value: "content" },
      { label: "النهايه", value: "footer" },
    ];

    this.pageTypeOptions = [
      { label: "A4", value: "A4" },
      { label: "A3", value: "A3" },
      { label: "A5", value: "A5" },
    ];

  }



  //this function used for send templateRef from component to another component.
  showHeaderTemplate(templateRef: TemplateRef<any>) {
    this.headerTemplate.push(templateRef);
  }


  //open edit dialog for text box
  showAddTextDialog() {
    this.displayDialogAddText = true;
  }

  //create text box
  createTextBox() {

    if (this.value != "") {
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(TextAreaComponent);
      let textComponent: any;
      switch (this.postionSelected) {
        case "header":
          textComponent = this.componentHeader.createComponent(componentFactory);
          break;
        case "content":
          textComponent = this.elementsContainer.createComponent(componentFactory);
          break;
        default:
          textComponent = this.componentFooter.createComponent(componentFactory);
          break;
      }


      textComponent.instance.addingMode = true;
      textComponent.instance.value = this.value;
      this.value = "";
      this.closeTextBoxDialog();
      this.toasterService.success('تم انشاء النص بنجاح', 'نجح');
    }
    else
    {
      this.toasterService.warning('حقل الكتابه لايمكن ان يكون فارغا', 'تحذير');

    }

  }


  closeTextBoxDialog() {
    this.displayDialogAddText = false;
  }

  //create table
  createTable() {

    console.log(this.cols);
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(TableComponent);
    const table = this.elementsContainer.createComponent(componentFactory);
    table.instance.reports = this.reports;
    table.instance.cols = this.cols;
    table.instance._selectedColumns = this.cols;
    this.toasterService.success('تم انشاء الجدول بنجاح', 'نجح');
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

      let addImageComponent: any;
      switch (this.postionSelected) {
        case "header":
          addImageComponent = this.componentHeader.createComponent(componentFactory);
          break;
        case "content":
          addImageComponent = this.elementsContainer.createComponent(componentFactory);
          break;
        default:
          addImageComponent = this.componentFooter.createComponent(componentFactory);
          break;
      }

      addImageComponent.instance.imageSrc = this.imageSrc;
      this.displayDialogAddImage = false;
      this.toasterService.success('تم انشاء الصورة بنجاح', 'نجح');

    }
    else
    {
      this.toasterService.warning('يجب اختيار صورة اولا', 'تحذير');
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
        this.toasterService.success('تم انشاء الرسم بنجاح', 'نجح');
      }
      else
      {
        this.toasterService.warning('يجب تحديد المدخلات اولا', 'تحذير');
      }
    }
    else {
      this.toasterService.warning('يجب تحديد المدخلات اولا', 'تحذير');
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
        this.toasterService.success('تم انشاء الرسم بنجاح', 'نجح');

      }
      else{

        this.toasterService.warning('يجب تحديد المدخلات اولا', 'تحذير');
      
      }
    }
    else {
      this.toasterService.warning('يجب تحديد المدخلات اولا', 'تحذير');
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


  displaySidebar() {
    this._displaySidebar = !this._displaySidebar;
  }



  //configuration of angular Editor
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'اكتب ما تريد هنا...',
    defaultParagraphSeparator: '',
    defaultFontName: 'Cairo, sans-serif',
    defaultFontSize: '',
    fonts: [
      { class: "Cairo, sans-serif", name: 'Cairo, sans-serif' },
      { class: "'IBM Plex Sans Arabic', sans-serif", name: 'IBM Plex Sans Arabic' },
      { class: "arial", name: 'Arial' },
      { class: "times-new-roman", name: 'Times New Roman' },
      { class: "'Rubik', sans-serif", name: 'Rubik' },
      { class: '"Amiri", serif', name: '"Amiri", serif' },


    ],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [

        // 'customClasses',
        'insertVideo',
        'insertHorizontalRule',
        'toggleEditorMode'
      ]
    ]
  };


  confirmationDeleteDetailsTable(detailsTable: ElementRef) {
    detailsTable.nativeElement.remove();
  }


  //export as pdf
  async makePdf() {
    html2canvas(this.exportPdf.nativeElement).then((imageCanvas) => {

      const imgData = imageCanvas.toDataURL("image/png");
      console.log(imgData);
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = imageCanvas.height * imgWidth / imageCanvas.width;
      var heightLeft = imgHeight;

      var doc = new jsPDF('p', 'mm', 'a4');
      var position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = (heightLeft - imgHeight)
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save('reporting' + '.pdf')

    })
  }



}


