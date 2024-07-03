import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng-lts/dynamicdialog';


@Component({
  selector: 'app-text-editor-dialog',
  templateUrl: './text-editor-dialog.component.html',
  styleUrls: ['./text-editor-dialog.component.css'],
})
export class TextEditorDialogComponent implements OnInit , AfterViewInit{
  @ViewChild("reviewText") reviewText!:ElementRef;

  display: boolean = false;
  alignStyle: string = "right";
  isItalic: boolean;
  isUndeline: boolean;
  isBold: boolean;


  constructor(private config: DynamicDialogConfig,  public ref: DynamicDialogRef, private _FormBuilder: FormBuilder) { }





  textEditableForm: FormGroup = this._FormBuilder.group({
    family: [this.config.data.family],
    size: [this.config.data.size],
    // style: [(this.config.data.style == "false") ? ["false"] : ["true"]],
    // decoration: [(this.config.data.decoration == "false") ? ["false"] : ["true"]],
    // weight: [(this.config.data.weight == "false") ? ["false"] : ["true"]],
    color: [this.config.data.color],
    // align: [this.config.data.align]
  });


  editTextFormSubmit(textEditableForm:FormGroup){
    const style = this.isItalic ? "true" : "false";
    const decoration = this.isUndeline ? "true" : "false";
    const weight = this.isBold ? "true" : "false";

    const allVal = {...textEditableForm.value , align:this.alignStyle, style , decoration, weight}
    this.ref.close(allVal);
  }

  ngOnInit(): void {
    this.alignStyle = this.config.data.align;
    this.isItalic = this.config.data.style == 'true' ? true : false;
    this.isUndeline = this.config.data.decoration == 'true' ? true : false;
    this.isBold = this.config.data.weight  == 'true' ? true : false;
  }

  ngAfterViewInit(): void {
    this.reviewText.nativeElement.style.textAlign= this.alignStyle;
    this.reviewText.nativeElement.style.fontStyle= this.isItalic ? 'italic' : 'noraml';
    this.reviewText.nativeElement.style.textDecoration= this.isUndeline ? 'underline' : 'none';
    this.reviewText.nativeElement.style.fontWeight= this.isBold ? 'bold' : 'normal';
    this.reviewText.nativeElement.style.fontFamily= this.config.data.family;
    this.reviewText.nativeElement.style.fontSize= `${this.config.data.size}px`;
    this.reviewText.nativeElement.style.color= this.config.data.color;
  }

  closeDialog() {

    this.ref.close(undefined);
  }

  showDialog() {
    this.display = true;
  }


  changeAlign(alignValue: string) {
    this.alignStyle = alignValue;
    this.reviewText.nativeElement.style.textAlign= this.alignStyle;
  }

  selectItalic() {
    this.isItalic = !this.isItalic;
    this.reviewText.nativeElement.style.fontStyle= this.isItalic ? 'italic' : 'noraml';
  }

  selectUndeline() {
    this.isUndeline = !this.isUndeline;
    this.reviewText.nativeElement.style.textDecoration= this.isUndeline ? 'underline' : 'none';
  }

  selectBold() {
    this.isBold = !this.isBold;
    this.reviewText.nativeElement.style.fontWeight= this.isBold ? 'bold' : 'normal';
  }

  changeFamilyReview(event:any){
    this.reviewText.nativeElement.style.fontFamily= event.target.value;
  }

  changeSizeReview(event:any){
    this.reviewText.nativeElement.style.fontSize= `${event.target.value}px`;
  }

  changeColorReview(event:any){
    this.reviewText.nativeElement.style.color= event.target.value;
  }




}
