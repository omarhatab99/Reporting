import { Component, ElementRef , OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng-lts/dynamicdialog';


@Component({
  selector: 'app-text-edit-dialog',
  templateUrl: './text-edit-dialog.component.html',
  styleUrls: ['./text-edit-dialog.component.css']
})
export class TextEditDialogComponent implements OnInit {

  @ViewChild("reviewText") reviewText!:ElementRef;
  oldText:string;
  color:string = "#000";

  constructor(private config:DynamicDialogConfig , private _FormBuilder:FormBuilder) { }

  textEditableForm:FormGroup = this._FormBuilder.group({
    // family:[this.data.family],
    // size:[this.data.size],
    // style:[(this.data.style == "false") ? ["false"] : ["true"]],
    // decoration:[(this.data.decoration == "false") ? ["false"] : ["true"]],
    // weight:[(this.data.weight == "false") ? ["false"] : ["true"]],
    // color:[this.data.color],
    // align:[this.data.align]
  })

  ngOnInit(): void {
    console.log(this.config.data);
  }

  editTextFormSubmit(textEditableForm:FormGroup){

    // if(textEditableForm.valid){

    //   console.log(textEditableForm.value);
    //   textEditableForm.value.style = textEditableForm.value.style.length == 0 ? ["false"] :  textEditableForm.value.style;
    //   textEditableForm.value.weight = textEditableForm.value.weight.length == 0 ? ["false"] :  textEditableForm.value.weight; 
    //   textEditableForm.value.decoration = textEditableForm.value.decoration.length == 0 ? ["false"] : textEditableForm.value.decoration;


    // }


  }



  changeFamilyReview(event:any){
    console.log(event.value);
    this.reviewText.nativeElement.style.fontFamily= event.value;
  }

  changeSizeReview(event:any){
    this.reviewText.nativeElement.style.fontSize= `${event.value}px`;
  }

  changeAlignReview(event:any){
    this.reviewText.nativeElement.style.textAlign= event.value;
  }

  changeWeightReview(event:any){
    this.reviewText.nativeElement.style.fontWeight= (event.value[0]) == "true" ? 'bold' : 'normal';
  }

  changeItalicReview(event:any){
    this.reviewText.nativeElement.style.fontStyle= (event.value[0]) == "true" ? 'italic' : 'normal';
  }

  changeUnderlineReview(event:any){
    this.reviewText.nativeElement.style.textDecoration= (event.value[0]) == "true" ? 'underline' : 'none';
  }

  changeColorReview(event:any){
    this.reviewText.nativeElement.style.color= event.target.value;
  }
}
