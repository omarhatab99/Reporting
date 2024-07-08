import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { ConfirmationService } from 'primeng-lts/api';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  @Input() imageSrc:any = "";
  @Input() previewSrc:any = "";
  @Input() imageWidth:any = 100;
  @ViewChild("priview") priview:ElementRef;
  @ViewChild("imageComponent") imageComponent:ElementRef;
  @ViewChild("selectedImageInput") selectedImageInput:ElementRef;
  @ViewChild("imageContainer") imageContainer:ElementRef;
  @ViewChild("imageDialog") imageDialog:ElementRef;

  displayDialogImage:boolean = false;
  constructor(private sanitizer:DomSanitizer , private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }


  showDialog(){
    this.displayDialogImage = true;
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
      this.displayDialogImage = false;

    }

  }

  close(){
    //this.priview.nativeElement.src = this.imageSrc;
    this.selectedImageInput.nativeElement.value = "";
    this.previewSrc = this.imageSrc;
    this.displayDialogImage = false;
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
      }
    });
  }
}
