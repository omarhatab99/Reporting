

import { Calendar } from 'primeng-lts';
import { DateTimeConfig } from './ConfigDateTime';
import { AfterViewChecked, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-DateTime',
  templateUrl: './DateTime.component.html',
  styleUrls: ['./DateTime.component.css'],
})
export class DateTimeComponent implements AfterViewChecked {
  @Input() DateConfig: DateTimeConfig = new DateTimeConfig();
  @Input() SelectDate: any = null;
  @Input() update: boolean = false;
  @Input() outPutFormat: "d/m/y" | "m/d/y" = "d/m/y";
  @Input() TypeDate: "stringText" | "DateObject" = "DateObject"
  @Input() disable: Date = null;
  @Output() SelectedDate = new EventEmitter<any>();
  constructor() {
  }
  ngOnInit() {
    this.EditDateSelect();
  }
  ngOnChanges() {
    this.EditDateSelect();
  }
  private EditDateSelect() {
    if (this.SelectDate != null) {
      if (this.TypeDate == "DateObject")
        this.DateConfig.SelectedDate = this.SelectDate;
      else if (this.TypeDate == "stringText") {
        this.DateConfig.SelectedDate = new Date(this.Editformat(this.SelectDate));
      }
    }
  }
  ngAfterViewChecked(): void {
    let Culender = document.getElementsByClassName("select");
    for (let i = 0; i < Culender.length; i++) {
      try {
        let targetStyle = Culender.item(i).children[0].children[0] as HTMLElement
        targetStyle.style.display = "flax"
      } catch { }
    }
    if (this.calender != null) {
      let calenderSelect = this.calender.children[0].children[1] as HTMLElement;
      if (calenderSelect != undefined) {
        calenderSelect.style.width = "350px"
      }
    }
  }
  private Editformat(selectData: any) {
    let text = selectData as string;
    let hours = text.split(" ")[1]
    let date = text.split(" ")[0]
    let day = "";
    let month = ""
    let year = ""
    let newFormat = ""
    if (this.outPutFormat == "d/m/y") {
      day = date.split("/")[0]
      month = date.split("/")[1]
      year = date.split("/")[2]
    }
    else {
      month = date.split("/")[0]
      day = date.split("/")[1]
      year = date.split("/")[2]
    }
    newFormat = month + "/" + day + "/" + year

    if (hours == undefined) {
      hours = "00:00:01";
    }
    newFormat += " " + hours;
    return newFormat;
  }
  // countDaysOnMonth(monthNumber: number, year: number) {
  //   switch (monthNumber) {
  //     case 1:
  //       return 31
  //     case 2:
  //       if (year % 4 === 0) {
  //         return 29;
  //       }
  //       else {
  //         return 28;
  //       }
  //     case 3:
  //       return 31;
  //     case 4:
  //       return 30;
  //     case 5:
  //       return 31;
  //     case 6:
  //       return 30;
  //     case 7:
  //       return 31;
  //     case 8:
  //       return 31;
  //     case 9:
  //       return 30;
  //     case 10:
  //       return 31;
  //     case 11:
  //       return 30;
  //     case 12:
  //       return 31;
  //   }
  // }
  // plusDateText(day: string, month: string, year: string): Array<string> {

  //   let dayN = Number.parseInt(day)
  //   let monthN = Number.parseInt(month)
  //   let yearN = Number.parseInt(year)
  //   let plusOnMonth = () => {
  //     if (monthN == 12) {
  //       monthN = 1;
  //       yearN += 1;
  //     }
  //     else {
  //       monthN++;
  //     }
  //   }
  //   let plusOnDay = () => {
  //     let nDayN = dayN + 1;
  //     if (this.countDaysOnMonth(monthN, yearN) >= nDayN) {
  //       dayN = nDayN;
  //     }
  //     else  if(this.countDaysOnMonth(monthN, yearN) < nDayN){
  //       dayN = 1
  //       plusOnMonth();
  //     }

  //   }
  //   plusOnDay();
  //   let dayS = dayN < 10 ? "0" + dayN.toString() : dayN.toString();
  //   let monthS = monthN < 10 ? "0" + monthN.toString() : monthN.toString();
  //   return [yearN.toString(), monthS, dayS]
  // }
  // convertDateToString(date: Date, outPutFormat: "d/m/y" | "m/d/y"): string {
  //   let tst= date.toLocaleDateString()
  //   let stringText = date.toISOString().split('T')[0];
  //   let year = stringText.split('-')[0];
  //   let month = stringText.split('-')[1];
  //   let day = stringText.split('-')[2];
  //   let hours = date.toISOString().split('T')[1].split('.')[0];
  //   if (!this.DateConfig.ShowTime) {
  //     var res=this.plusDateText(day,month,year);
  //     year=res[0];
  //     month=res[1];
  //     day=res[2];
  //   }
  //   if (outPutFormat == "d/m/y") {
  //     stringText = day + "/" + month + "/" + year
  //   }
  //   else {
  //     stringText = month + "/" + day + "/" + year
  //   }

  //   if (this.DateConfig.ShowTime) {
  //     stringText += " " + hours;
  //   }

  //   return stringText;
  // }

  convertDateToString(date: Date, outPutFormat: "d/m/y" | "m/d/y"): string {
    let stringText = "";
    if (outPutFormat == "d/m/y") {
      stringText = date.toLocaleDateString().split('/')[1] + "/" + date.toLocaleDateString().split('/')[0] + "/" + date.toLocaleDateString().split('/')[2]
    }
    else {
      stringText = date.toLocaleDateString();
    }
    return stringText;
  }

  OutValue(dateSelect: Date) {
    if (dateSelect != null) {
      this.DateConfig.SelectedDate = dateSelect;
      if (this.TypeDate == "stringText") {
        this.SelectDate = this.convertDateToString(dateSelect, this.outPutFormat);
        this.SelectedDate.emit(this.SelectDate)
      }
      else {
        this.SelectDate = dateSelect;
        this.SelectedDate.emit(dateSelect)
      }
    }
    else {
      this.SelectedDate.emit(dateSelect)
    }
  }
  calender: HTMLElement = null;
  editStyle(dateElement: Calendar) {
    if (dateElement != undefined && dateElement != null) {
      this.calender = dateElement.el.nativeElement
    }
    let spen = dateElement.el.nativeElement.children[0] as HTMLElement;
    if (spen != undefined) {
      let inputText = spen.children[0] as HTMLElement;

      if (inputText != undefined) {
        spen.style.display = "block"
        spen.style.width = "100%"
        inputText.style.display = "block"
        inputText.style.width = "100%"
        inputText.dir = "rtl"
      }
    }
  }
}
