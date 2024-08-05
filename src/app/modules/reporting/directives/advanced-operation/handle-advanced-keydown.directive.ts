import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHandleAdvancedKeydown]'
})
export class AppHandleAdvancedKeydown {

  inputElement: HTMLInputElement;
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let arthmaticOperationArray = ['+', '-', '/', '*', '%'];

    //get letter before and after cursor
    let letterBeforeCursor: string = '';
    let letterAfterCursor: string = '';

    //get cursor position
    const cursorPosition = this.inputElement.selectionStart ?? 0;

    letterBeforeCursor = this.inputElement.value.slice(cursorPosition - 2, cursorPosition);
    letterAfterCursor = this.inputElement.value.slice(cursorPosition, cursorPosition + 2);




    //handle keydown events

    if (cursorPosition > 0) {

      if (event.key == "(") { //check if key is '('

        //check if user write ( without any operation sign before it
        if (!arthmaticOperationArray.includes(letterBeforeCursor[0]) && !arthmaticOperationArray.includes(letterBeforeCursor[1])) {

          event.preventDefault();

        }
      }

      //check if user write ')'  without open bracket before it 
      if (event.key == ")") {
        let filteredSplitBracketArray = this.inputElement.value.split("").slice(0, cursorPosition + 1);

        //get length of start bracket length
        let startBracketLength = filteredSplitBracketArray.filter((element) => element == "(").length;
        //get length of end bracket length
        let endBracketLength = filteredSplitBracketArray.filter((element) => element == ")").length;
        //check if startBracket length less than or equal endBracket length 
        if (startBracketLength <= endBracketLength)
          event.preventDefault();

      }


    }



    if (event.key == "+" || event.key == "/" || event.key == "-" || event.key == "*" || event.key == "%") {

      //check if user write sign operator in first index 
      if (cursorPosition == 0) {
        event.preventDefault();
      }

      //check if user write negative number after '('
      if (event.key != "-" && (letterBeforeCursor == "(" || letterBeforeCursor == " (" || letterBeforeCursor == "( ")) {
        event.preventDefault();
      }

      //check if user write two sign operator 
      if (
        letterBeforeCursor.includes("+")
        || letterBeforeCursor.includes("-")
        || letterBeforeCursor.includes("/")
        || letterBeforeCursor.includes("*")
        || letterBeforeCursor.includes("%")
        || letterAfterCursor.includes("+")
        || letterAfterCursor.includes("-")
        || letterAfterCursor.includes("/")
        || letterAfterCursor.includes("*")
        || letterAfterCursor.includes("%")) {
        event.preventDefault();
      }



      //check if user write any sign operator between fx(____)
      if (!new RegExp("[0-9]").test(letterBeforeCursor[1]) && !new RegExp("[0-9]").test(letterAfterCursor[0]) && letterBeforeCursor[1] != ")" && letterAfterCursor != "fx") {
        event.preventDefault();
      }

      if ((letterBeforeCursor[1] == "f" || letterBeforeCursor[1] == "x" || letterAfterCursor[0] == "f" || letterAfterCursor[1] == "x" || letterBeforeCursor[1] == "f" || letterAfterCursor[0] == "x") && !(letterBeforeCursor[1] == ")" && letterAfterCursor == "fx")) {
        event.preventDefault();
      }

      if (letterBeforeCursor == "x(") {
        event.preventDefault();
      }

    }

    //check if user write dot without number before it
    if (event.key == ".") {
      if (!new RegExp("[0-9]").test(letterBeforeCursor[1])) {
        event.preventDefault();
      }
    }

    //check if user write numbers
    if (new RegExp("[0-9]").test(event.key)) {

      //prevent user to divide on zero
      if (letterBeforeCursor == "/ " && event.key == "0") {
        event.preventDefault();
      }

      //
      if (cursorPosition > 1) {

        //check if user write number after " " without any sign operator or '(' before it
        if (!arthmaticOperationArray.includes(letterBeforeCursor[0]) && !arthmaticOperationArray.includes(letterBeforeCursor[1]) && !new RegExp("[0-9]").test(letterBeforeCursor[1]) && letterBeforeCursor[1] != "(" && letterBeforeCursor[1] != ".") {
          event.preventDefault();
        }

        //check if user write number after ) without any sign operator
        if (letterBeforeCursor[0] == ")" || letterBeforeCursor[1] == ")") {
          event.preventDefault();
        }

        //check if user write number after space or wrtie number before (space then number)
        if ((new RegExp("[0-9]").test(letterBeforeCursor[0]) && letterBeforeCursor[1] == " ") || (new RegExp("[0-9]").test(letterAfterCursor[1]) && letterAfterCursor[0] == " ") && letterBeforeCursor[1] != ".") {
          event.preventDefault();
        }

        //check if user write number after sign without space
        if (arthmaticOperationArray.includes(letterBeforeCursor[1])) {
          event.preventDefault();
        }

        //check if user write any sign operator between fx(____)
        if (letterBeforeCursor[1] != " " && letterAfterCursor[0] != " " && !new RegExp("[0-9]").test(letterBeforeCursor[1]) && !new RegExp("[0-9]").test(letterAfterCursor[0]) && letterBeforeCursor[1] != ")" && letterBeforeCursor[1] != "(" && letterBeforeCursor[1] != ".") {

          event.preventDefault();
        }

        if (letterBeforeCursor == "x(") {
          event.preventDefault();
        }

      }

      if (letterBeforeCursor[1] == "f" || letterBeforeCursor[1] == "x" || letterAfterCursor[0] == "f" || letterAfterCursor[1] == "x" || letterBeforeCursor[1] == "f" || letterAfterCursor[0] == "x") {
        event.preventDefault();
      }

    }


    //if event key is Backspace (user remove from operation)
    if (event.key == "Backspace") {

      let arrayFromStartToCursorText = this.inputElement.value.slice(0, cursorPosition).split(" ").filter((element) => element != '');
      let advancedOperationSplitArray = this.inputElement.value.split(" ");
      let advancedOperationAfterDeleteSignOperationText: any = "";


      //if last of array is fx
      if (arrayFromStartToCursorText[arrayFromStartToCursorText.length - 1].includes("fx") || arrayFromStartToCursorText[arrayFromStartToCursorText.length - 1].includes("f")) {
        event.preventDefault();
        arrayFromStartToCursorText.splice(arrayFromStartToCursorText.length - 1, 1);

        advancedOperationSplitArray = [...arrayFromStartToCursorText, ...advancedOperationSplitArray.slice(arrayFromStartToCursorText.length + 2)];

      }//if last of array is arthmatic operator
      else if (arthmaticOperationArray.includes(arrayFromStartToCursorText[arrayFromStartToCursorText.length - 1])) {
        event.preventDefault();
        arrayFromStartToCursorText.splice(arrayFromStartToCursorText.length - 1, 1);

        console.log(arrayFromStartToCursorText);
        console.log(advancedOperationSplitArray);

        advancedOperationSplitArray = [...arrayFromStartToCursorText, ...advancedOperationSplitArray.slice(arrayFromStartToCursorText.length + 1)];
      }

      //remove space between number and add space around sign operator
      advancedOperationSplitArray.forEach((element) => {
        //check if element of array is sign operator to add space around it again.
        if (arthmaticOperationArray.includes((element)))
          advancedOperationAfterDeleteSignOperationText += ` ${element} `;
        else
          advancedOperationAfterDeleteSignOperationText += `${element}`;
      });


      this.inputElement.value = advancedOperationAfterDeleteSignOperationText;
    }


  }


}


