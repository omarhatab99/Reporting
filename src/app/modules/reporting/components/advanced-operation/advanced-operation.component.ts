import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-advanced-operation',
  templateUrl: './advanced-operation.component.html',
  styleUrls: ['./advanced-operation.component.css']
})
export class AdvancedOperationComponent implements OnInit, OnChanges {

  @Output() evaluationOperationDataArray: EventEmitter<any[]> = new EventEmitter();
  @Input() itemSource: any[] = [];
  @Input() selectedColumns: any[] = [];

  @ViewChild("arthmaticOperationContainer") arthmaticOperationContainer:ElementRef;
  //---------------------------------------
  advancedOperationMsgErrors: [];
  advancedOperationSplitArray: [];
  advancedOperationColumnShow: boolean = true;
  selectedNumberColumns: any[] = [];
  arthmaticOperatorValue:string = "";
  allElementsWithoutFxAndBracket:any[] = [];
  constructor() { }


  ngOnChanges(changes: SimpleChanges): void {
    //check if selectedColumns has been initialized
    if (this.selectedColumns != undefined && this.itemSource != undefined) {
      this.selectedNumberColumns = this.selectedColumns.filter((col) => {
        if (!Number.isNaN(parseFloat(this.itemSource[0][col.field]))) {
          return col;
        }
      });
      //handle selectedNumber columns for multiselect
      this.selectedNumberColumns = this.selectedNumberColumns.map((col) => { return { label: col.field, value: col.field } });
    }



  }

  ngOnInit(): void { }








  writeFx(columnName: string, arthmaticOperationContainer: HTMLInputElement) {

    let arthmaticOperationArray = ['+', '-', '/', '*', '%'];

    let cursorPosition = arthmaticOperationContainer.selectionStart ?? 0;

    let arrayFromStartToCursorText = arthmaticOperationContainer.value.slice(0, cursorPosition).split(" ").filter((element) => element != '');
    let advancedOperationSplitArray = arthmaticOperationContainer.value.split(" ");
    let advancedOperationAfterDeleteSignOperationText: any = "";
    let letterBeforeCursor: string = '';
    let letterAfterCursor: string = '';


    letterBeforeCursor = arthmaticOperationContainer.value.slice(cursorPosition - 2, cursorPosition);
    letterAfterCursor = arthmaticOperationContainer.value.slice(cursorPosition, cursorPosition + 2);

    arrayFromStartToCursorText.push(`fx(${columnName})`);

    advancedOperationSplitArray = [...arrayFromStartToCursorText, ...advancedOperationSplitArray.slice(arrayFromStartToCursorText.length - 1)];

    //remove space between number and add space around sign operator
    advancedOperationSplitArray.forEach((element) => {
      //check if element of array is sign operator to add space around it again.
      if (arthmaticOperationArray.includes((element)))
        advancedOperationAfterDeleteSignOperationText += ` ${element} `;
      else
        advancedOperationAfterDeleteSignOperationText += `${element}`;
    });

    arthmaticOperationContainer.value = advancedOperationAfterDeleteSignOperationText;
    this.evaluateOperationCalc(arthmaticOperationContainer);
     
  }


  afterSelectionChange(arthmaticOperationContainer) {
    let arthmaticOperationArray = ['+', '-', '/', '*', '%'];


    let cursorPosition = arthmaticOperationContainer.selectionStart ?? 0;
    let letterBeforeCursor: string = '';
    let letterAfterCursor: string = '';

    if (cursorPosition > 1) {

      letterBeforeCursor = arthmaticOperationContainer.value.slice(cursorPosition - 2, cursorPosition);
      letterAfterCursor = arthmaticOperationContainer.value.slice(cursorPosition, cursorPosition + 2);

      if (arthmaticOperationArray.includes(letterBeforeCursor[0]) || arthmaticOperationArray.includes(letterBeforeCursor[1]) || letterBeforeCursor[1] == "(")
        this.advancedOperationColumnShow = true;
      else
        this.advancedOperationColumnShow = false;
    }

    if (cursorPosition == 0) {
      this.advancedOperationColumnShow = true;
    }
  }


  //evaluate and emit value
  evaluateOperationCalc(arthmaticOperationContainer: HTMLInputElement) {
    let dataArray: any[] = [];
    //handle value opeartion by eval function
    let operationValue: any = arthmaticOperationContainer.value;

    //get fx() columns name
    const allElementsIncludeFxArray = operationValue.split(" ").map((element) => {
      if (element.includes("fx"))
        return this.getLimitspecificString("f", ")", element);
    }).filter((element) => element != undefined);

    this.allElementsWithoutFxAndBracket = allElementsIncludeFxArray.map((element) => {
      return element.slice(3, element.length - 1);
    });

    const handleFxArrayWithValues: any[] = [];

    this.itemSource.forEach((itemObject) => {
      let fxArrayElementObject = {};
      this.allElementsWithoutFxAndBracket.forEach(elementKey => {
        fxArrayElementObject[elementKey] = itemObject[elementKey];
      });
      handleFxArrayWithValues.push(fxArrayElementObject);
    });

    handleFxArrayWithValues.forEach((handleFxArrayWithValuesObject) => {

      let handleOperationValue: any = operationValue;
      for (const key in handleFxArrayWithValuesObject) {
        handleOperationValue = handleOperationValue.replaceAll(`fx(${key})`, `${parseFloat(handleFxArrayWithValuesObject[key])}`);
      }

      const evalOperationValue = eval(handleOperationValue);
      dataArray.push(evalOperationValue);

    });

    this.evaluationOperationDataArray.emit(dataArray);
  }



  //get limit specific string
  getLimitspecificString(startChar: string, endChar: string, element): any {
    // Find the positions of the start and end characters
    const startIndex = element.indexOf(startChar);
    const endIndex = element.indexOf(endChar, startIndex + 1);

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      // Extract the substring between startChar and endChar
      const resultString = element.substring(startIndex, endIndex + 1);
      return resultString;
    }
    else {
      return undefined;
    }
  }

}
