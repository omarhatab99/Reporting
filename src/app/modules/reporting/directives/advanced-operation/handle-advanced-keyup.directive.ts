import { Directive, ElementRef, HostListener } from '@angular/core';
import { cw } from '@fullcalendar/core/internal-common';
import { element } from 'protractor';

@Directive({
  selector: '[appHandleAdvancedKeyup]'
})
export class HandleAdvancedKeyupDirective {

  inputElement: HTMLInputElement;
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {


    let advancedOperationSplitArray: any[] = [];
    let arthmaticOperationArray = ['+', '-', '/', '*', '%'];

    //get letter before and after cursor
    let letterBeforeCursor: string = '';
    let letterAfterCursor: string = '';

    //get cursor position
    const cursorPosition = this.inputElement.selectionStart ?? 0;

    letterBeforeCursor = this.inputElement.value.slice(cursorPosition - 2, cursorPosition);
    letterAfterCursor = this.inputElement.value.slice(cursorPosition, cursorPosition + 2);

    //if event key is number or operation sign
    if (new RegExp("[0-9]").test(event.key) || arthmaticOperationArray.includes(event.key) || event.key == "(" || event.key == ")") {
      //handle operation signs with add space
      let arthmaticOperationTextHandle: any = this.inputElement.value;
      arthmaticOperationTextHandle = arthmaticOperationTextHandle
        .replaceAll("+", " + ")
        .replaceAll("-", " - ")
        .replaceAll("*", " * ")
        .replaceAll("/", " / ")
        .replaceAll("  ", " ");

      this.inputElement.value = arthmaticOperationTextHandle;
    }


    //check if user write sign operator in bracket cursor will back step
    if (arthmaticOperationArray.includes(event.key) && cursorPosition != 0) {
      letterBeforeCursor = this.inputElement.value.slice(cursorPosition - 2, cursorPosition);
      letterAfterCursor = this.inputElement.value.slice(cursorPosition, cursorPosition + 3);

      if ((arthmaticOperationArray.includes(letterAfterCursor[0]) && letterAfterCursor[1] == " " && letterAfterCursor[2] == ")") || (letterAfterCursor[0] == ")") || (letterAfterCursor == "  )")) {
        if (cursorPosition > 0) {
          this.inputElement.setSelectionRange(cursorPosition + 2, cursorPosition + 2);
        }
      }
    }

    //if event key is Backspace (user remove from operation)
    if (event.key == "Backspace") {

      //split inputElement value to get array from it value
      advancedOperationSplitArray = this.inputElement.value.split(" ");
      let advancedOperationAfterDeleteSignOperationText: any = "";

      //remove space between number and add space around sign operator
      advancedOperationSplitArray.forEach((element) => {
        //check if element of array is sign operator to add space around it again.
        if (arthmaticOperationArray.includes((element)))
          advancedOperationAfterDeleteSignOperationText += ` ${element} `;
        else
          advancedOperationAfterDeleteSignOperationText += `${element}`;
      });

      console.log(advancedOperationSplitArray);

      advancedOperationAfterDeleteSignOperationText = advancedOperationAfterDeleteSignOperationText
      .replaceAll("+", " + ")
      .replaceAll("-", " - ")
      .replaceAll("*", " * ")
      .replaceAll("/", " / ")
      .replaceAll("  ", " ")

      //assign operation to value without spaces between numbers here
      this.inputElement.value = advancedOperationAfterDeleteSignOperationText;

    }
  }

}
