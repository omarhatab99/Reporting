import { Component, ContentChild, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng-lts/api';
import { DialogService } from 'primeng-lts/dynamicdialog';
import { TextEditorDialogComponent } from 'src/app/dialogs/text-editor-dialog/text-editor-dialog.component';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css'],
  providers: [DialogService],
})
export class TextAreaComponent implements OnInit {
  @ContentChild("textArea") textArea: ElementRef;
  @ViewChild("textArea") textAreaAdding: ElementRef;

  value:string = "Add Text Here";
  addingMode:boolean = false;

  constructor(private _DialogService: DialogService , private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  //open edit dialog for text box
  openEditTextDialog() {
    
    //get target element 
    const targetElement = this.addingMode ? this.textAreaAdding.nativeElement : this.textArea.nativeElement;
    //get all data attributes from element.
    const family = targetElement.getAttribute("data-fontFamily");
    const size = targetElement.getAttribute("data-fontSize");
    const decoration = targetElement.getAttribute("data-decoration");
    const style = targetElement.getAttribute("data-style");
    const weight = targetElement.getAttribute("data-weight");
    const color = targetElement.getAttribute("data-color");
    const align = targetElement.getAttribute("data-align");
    //open dialog and send data
    this._DialogService.open(TextEditorDialogComponent, { width: "500px", data: { family, size, decoration, style, weight, color, align } , header:"تعديل النص" })
      .onClose.subscribe((observer) => {

        if (observer != undefined && observer != "") {

          //change element style 
          targetElement.style.fontFamily = observer.family;
          targetElement.style.fontSize = `${observer.size}px`;
          targetElement.style.color = observer.color;
          targetElement.style.textDecoration = observer.decoration == "true" ? 'underline' : 'none';
          targetElement.style.fontStyle = observer.style == "true" ? 'italic' : 'normal';
          targetElement.style.fontWeight = observer.weight == "true" ? 'bold' : 'normal';
          targetElement.style.textAlign = observer.align;

          //change element attributes
          targetElement.setAttribute("data-fontFamily", observer.family);
          targetElement.setAttribute("data-fontSize", observer.size);
          targetElement.setAttribute("data-decoration", observer.decoration);
          targetElement.setAttribute("data-style", observer.style);
          targetElement.setAttribute("data-weight", observer.weight);
          targetElement.setAttribute("data-color", observer.color);
          targetElement.setAttribute("data-align", observer.align);
        }


      })
  }

  //delete text box element
  confirmationDeleteTextBox(event: any) {
    this.confirmationService.confirm({
      message: 'هل انت متاكد من حذف العنصر لن تكون قادر على استعادته',
      accept: () => {
          //Actual logic to perform a confirmation
          this.textArea.nativeElement.remove();
      }
    });
  }



}
