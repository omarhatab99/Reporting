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





@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DialogService],
})



export class ReportComponent implements OnInit {
  // @ViewChildren("itemElement") private itemElements: QueryList<ElementRef>;
  @ViewChild('componentContainer', { read: ViewContainerRef }) elementsContainer!: ViewContainerRef;
  @ViewChild("priview") priview:ElementRef;
  @ViewChild("selectedImageInput") selectedImageInput:ElementRef;
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
  displayDialogAddImage:boolean = false;
  imageSrc:any = "assets/placeholder_image.png";
  headerTemplate: TemplateRef<any>[] = [];
  tableNumber:number = 1;
  dateNow:any;
  selectedImagePosition:any = "content";

  //constructor
  constructor(private _ComponentFactoryResolver: ComponentFactoryResolver, private confirmationService: ConfirmationService , private sanitizer:DomSanitizer ) {
    this.chartConfig.ChartData.datasets = [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
    this.chartConfig.ChartData.labels = ["samy", "ahmed", "mohamed"]
    this.chartConfig.type="doughnut"
  }

  showHeaderTemplate(templateRef: TemplateRef<any>) {
    this.headerTemplate.push(templateRef);
    console.log(this.headerTemplate);

  }

  showDialogAddImage(){
    this.displayDialogAddImage = true;
    this.selectedImageInput.nativeElement.value = "";
  }

  selectedImage(event:any) {
    const urlSrc = URL.createObjectURL(event.target.files[0]);
    this.imageSrc = urlSrc;
    console.log(this.imageSrc);
    let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlSrc);
    this.imageSrc = sanitizedUrl;

  }


  close(){
    this.displayDialogAddImage = false;
    this.imageSrc = "assets/placeholder_image.png";
    this.selectedImageInput.nativeElement.value = "";
  }

  dialogAddImageHide() {
    this.imageSrc = "assets/placeholder_image.png";
    this.selectedImageInput.nativeElement.value = "";
  }

  createImage(){

    if(this.selectedImageInput.nativeElement.value) {
      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddImageComponent);
      const addImageComponent = this.elementsContainer.createComponent(componentFactory);
      addImageComponent.instance.imageSrc = this.imageSrc;
      this.displayDialogAddImage = false;
    }


  }

  //onInit
  ngOnInit(): void {

    //defaults value 
    this.content.padding = 20;
    this.header.height = 80;
    this.content.height = 500;
    this.border.size = "1";

    this.dateNow = new Date();




  }






  createTextBox() {
    // let dynamicComponent=await this.renderComponent(`<p>samy</p><p>{{name}}</p>`)
    // dynamicComponent.name="samy"
    const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(AddTextAreaComponent);
    this.elementsContainer.createComponent(componentFactory);
  }

  createTable(){

      const componentFactory = this._ComponentFactoryResolver.resolveComponentFactory(TableComponent);
      const table = this.elementsContainer.createComponent(componentFactory);
      

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
