import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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

  displayDialogChangeImage:boolean = false;
  constructor(private sanitizer:DomSanitizer , private confirmationService: ConfirmationService , private toasterService: ToastrService) { }


  ngOnInit(): void {}

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



  confirmationDeleteTextBox(){
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
