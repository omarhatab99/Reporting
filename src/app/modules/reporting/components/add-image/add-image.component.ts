import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng-lts/api';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.css']
})
export class AddImageComponent implements OnInit {
  //selected elements in dom
  @ViewChild("priview") priview:ElementRef;
  @ViewChild("imageContainer") imageContainer:ElementRef;
  @ViewChild("imageDialog") imageDialog:ElementRef;
  @ViewChild("selectedImageInput") selectedImageInput:ElementRef;
  //inputs
  @Input() imageSrc:any = "";
  @Input() previewSrc:any = "";
  @Input() imageWidth:any = 100;
  @ViewChild("imageMenu") imageMenu: ContextMenuComponent;
  isFlyingElement: boolean = false;
  displayDialogChangeImage:boolean = false;
  currentImageWidth:any;
  currentImageHeight:any;
  currentTransform:any;
  //to reset drag transform (fixed issue)
  dragPosition:any= {x: 0, y: 0};


  constructor(private sanitizer:DomSanitizer , private confirmationService: ConfirmationService , private toasterService: ToastrService ,  private contextMenuService: ContextMenuService) { }


  ngOnInit(): void {}

  ngAfterViewInit(): void {
    //const parentHeightValue = getComputedStyle(this.imageContainer.nativeElement.closest(".my-parent")).getPropertyValue('height');
    this.currentImageWidth = getComputedStyle(this.imageContainer.nativeElement).getPropertyValue('width');
    this.currentImageHeight = getComputedStyle(this.imageContainer.nativeElement).getPropertyValue('height');
  }

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.imageMenu,
      event: $event,
      item: item,
    });
    console.log("hello");
    console.log($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }


  // makeElementFly(element: any) {

  //   this.isFlyingElement = !this.isFlyingElement;

  //   if (this.isFlyingElement) {
  //     element.style.position = "absolute";

  //     element.style.width = "max-content";

  //   }
  //   else
  //   {
  //     element.style.position = "relative";

  //     element.style.width = "fit-content";
  //   }

  // }

  
  makeElementFly(element: any) {

    this.isFlyingElement = !this.isFlyingElement;
    if (this.isFlyingElement) {
      this.imageContainer.nativeElement.style.inset = "unset";
      element.style.position = "absolute";
    }
    else {

      this.imageContainer.nativeElement.style.margin = "0px 0px 0px 0px";
      this.imageContainer.nativeElement.style.marginLeft = "0px";
      this.imageContainer.nativeElement.style.marginBottom = "0px";
      this.imageContainer.nativeElement.style.marginTop = "0px";
      this.imageContainer.nativeElement.style.marginRight = "0px";
      this.imageContainer.nativeElement.style.left = "0px";
      this.imageContainer.nativeElement.style.bottom = "0px";
      this.imageContainer.nativeElement.style.top = "0px";
      this.imageContainer.nativeElement.style.right = "0px";
      element.style.position = "relative";

    }

  }

  resetElement(element:any){

    //reset drag position
    this.dragPosition = {x: 0, y: 0};
    this.isFlyingElement = false;
    this.imageContainer.nativeElement.style.width = this.currentImageWidth;
    this.imageContainer.nativeElement.style.height = 'auto';
    this.imageContainer.nativeElement.style.margin = "0px 0px 0px 0px";
    this.imageContainer.nativeElement.style.marginLeft = "0px";
    this.imageContainer.nativeElement.style.marginBottom = "0px";
    this.imageContainer.nativeElement.style.marginTop = "0px";
    this.imageContainer.nativeElement.style.marginRight = "0px";
    element.style.position = "relative";

  }

  showAddImageDialog(){
    this.displayDialogChangeImage = true;
    this.selectedImageInput.nativeElement.value = "";
    this.previewSrc = this.imageSrc;
  }

  selectedImage(event:any) {
    const urlSrc = URL.createObjectURL(event.target.files[0]);
    let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlSrc);
    this.previewSrc = sanitizedUrl;
  }

  changeImage(){
    if(this.selectedImageInput.nativeElement.value) {

      let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.priview.nativeElement.src);
      this.imageSrc = sanitizedUrl;
      this.displayDialogChangeImage = false;

    }

  }

  closeChangeImageDialog(){
    //this.priview.nativeElement.src = this.imageSrc;
    this.selectedImageInput.nativeElement.value = "";
    this.previewSrc = this.imageSrc;
    this.displayDialogChangeImage = false;
  }

  dialogAddImageHide() {
    this.selectedImageInput.nativeElement.value = "";
    this.previewSrc = this.imageSrc;
  }



  confirmationDeleteImage(){
    this.confirmationService.confirm({
      message: 'هل انت متاكد من حذف العنصر لن تكون قادر على استعادته',
      accept: () => {
          //Actual logic to perform a confirmation
          this.imageContainer.nativeElement.remove();
          this.imageDialog.nativeElement.remove();
          this.toasterService.success('تم حذف الصورة بنجاح', 'نجح');
      }
    });
  }
}
