import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-ImagePreview',
  templateUrl: './ImagePreview.component.html',
  styleUrls: ['./ImagePreview.component.css'],
})
export class ImagePreviewComponent {
  @Input() ClassStyle: string = "col-6"
  @Input() images: Array<PhotoData> = [
    {
      alt: "sss",
      itemImageSrc: "assets/images/Money.png",
      thumbnailImageSrc: "assets/images/Money.png",
      titel: "titel 1"
    },
    {
      alt: "sss",
      itemImageSrc: "assets/images/er.jpg",
      thumbnailImageSrc: "assets/images/er.jpg",
      titel: "titel 1"
    },
    {
      alt: "sss",
      itemImageSrc: "assets/images/Money.png",
      thumbnailImageSrc: "assets/images/Money.png",
      titel: "titel 1"
    },
    {
      alt: "sss",
      itemImageSrc: "assets/images/er.jpg",
      thumbnailImageSrc: "assets/images/er.jpg",
      titel: "titel 1"
    },
    {
      alt: "sss",
      itemImageSrc: "assets/images/Money.png",
      thumbnailImageSrc: "assets/images/Money.png",
      titel: "titel 1"
    },
    {
      alt: "sss",
      itemImageSrc: "assets/images/er.jpg",
      thumbnailImageSrc: "assets/images/er.jpg",
      titel: "titel 1"
    }, {
      alt: "sss",
      itemImageSrc: "assets/images/Money.png",
      thumbnailImageSrc: "assets/images/Money.png",
      titel: "titel 1"
    },
    {
      alt: "sss",
      itemImageSrc: "assets/images/er.jpg",
      thumbnailImageSrc: "assets/images/er.jpg",
      titel: "titel 1"
    },
  ];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  responsiveOptions2: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5
    },
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  displayCustom: boolean;
  activeIndex: number = 0;
  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }
}
export interface PhotoData {
  itemImageSrc: string,
  thumbnailImageSrc: string,
  alt: string,
  titel: string
}