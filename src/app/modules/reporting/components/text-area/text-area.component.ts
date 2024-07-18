import { AfterContentInit, AfterViewInit, Component, ContentChild, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng-lts/api';
import { DialogService } from 'primeng-lts/dynamicdialog';
import { ContextMenuService } from 'ngx-contextmenu';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css'],
  providers: [DialogService],
})
export class TextAreaComponent implements OnInit, AfterViewInit {
  @ViewChild("textBoxContainer") textBoxContainer: ElementRef;
  @ViewChild("textBox") textBox:ElementRef;
  @ContentChild("textArea") textArea: ElementRef;
  @ViewChild("textArea") textAreaAdding: ElementRef;
  @ViewChild("textAreaMenu") textAreaMenu: ContextMenuComponent;
  isFlyingElement: boolean = false;
  /*textEditor dialog */
  displayDialogAddText: boolean = false;

  /*adding text dialog */
  value: string = "";
  addingMode: boolean = false;
  dragPosition:any= {x: 0, y: 0};
  
  constructor(private _DialogService: DialogService, private confirmationService: ConfirmationService, private toasterService: ToastrService, private contextMenuService: ContextMenuService) { }



  ngOnInit(): void {
  }


  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.textAreaMenu,
      event: $event,
      item: item,
    });
    console.log("hello");
    console.log($event, item);
    $event.preventDefault();
    $event.stopPropagation();
  }


  // makeElementFly(element: any) {

  //   console.log(element);
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
      element.style.position = "absolute";
      element.style.width = "max-content";
    }
    else {

      // element.style.margin = "0px 0px 0px 0px";
      // element.style.marginLeft = "0px";
      // element.style.marginBottom = "0px";
      // element.style.marginTop = "0px";
      // element.style.marginRight = "0px";
      // element.style.left = "0px";
      // element.style.bottom = "0px";
      // element.style.top = "0px";
      // element.style.right = "0px";
      element.style.width = "fit-content";
      element.style.position = "relative";

    }

  }

  resetElement(element:any){

    //reset drag position
    this.dragPosition = {x: 0, y: 0};
    this.isFlyingElement = false;
    // element.nativeElement.style.width = this.currentImageWidth;
    // element.nativeElement.style.height = 'auto';
    // element.nativeElement.style.margin = "0px 0px 0px 0px";
    // element.nativeElement.style.marginLeft = "0px";
    // element.nativeElement.style.marginBottom = "0px";
    // element.nativeElement.style.marginTop = "0px";
    // element.nativeElement.style.marginRight = "0px";
    element.style.width = "fit-content";
    element.style.position = "relative";

  }

  ngAfterViewInit(): void {
    if (this.addingMode == true) { //incase adding text
      console.log(this.value);
      console.log(this.addingMode);
      console.log(this.textAreaAdding.nativeElement)
      this.textAreaAdding.nativeElement.innerHTML = this.value;
    }
  }



  //open edit dialog for text box
  showEditTextDialog() {
    this.displayDialogAddText = true;
    this.value = (this.addingMode) ? this.textAreaAdding.nativeElement.innerHTML : this.textArea.nativeElement.innerHTML;
  }

  //delete text box element
  confirmationDeleteTextBox() {
    this.confirmationService.confirm({
      message: 'هل انت متاكد من حذف العنصر لن تكون قادر على استعادته',
      accept: () => {
        //Actual logic to perform a confirmation
        this.textBoxContainer.nativeElement.remove();
        this.toasterService.success('تم حذف النص بنجاح', 'نجح');
      }
    });
  }



  createTextBox() {
    if (this.value != "") {
      if (this.addingMode == true) {
        this.textAreaAdding.nativeElement.innerHTML = this.value;
      }
      else {
        this.textArea.nativeElement.innerHTML = this.value;
      }

      this.closeTextBoxDialog();
    }

  }

  closeTextBoxDialog() {
    this.displayDialogAddText = false;
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
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
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



}
