import { AfterContentInit, AfterViewInit, Component, ContentChild, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng-lts/api';
import { DialogService } from 'primeng-lts/dynamicdialog';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css'],
  providers: [DialogService],
})
export class TextAreaComponent implements OnInit, AfterViewInit {
  @ViewChild("textBoxContainer") textBoxContainer: ElementRef;
  @ContentChild("textArea") textArea: ElementRef;
  @ViewChild("textArea") textAreaAdding: ElementRef;

  /*textEditor dialog */
  displayDialogAddText: boolean = false;

  /*adding text dialog */
  value: string = "";
  addingMode: boolean = false;

  constructor(private _DialogService: DialogService, private confirmationService: ConfirmationService , private toasterService: ToastrService) { }



  ngOnInit(): void {
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
  confirmationDeleteTextBox(event: any) {
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
