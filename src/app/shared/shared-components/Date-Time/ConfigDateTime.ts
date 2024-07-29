export class DateTimeConfig {
    constructor(date: any = new Date()) {
        this.SelectedDate = date;
    }
    SelectedDate: Date = null;
    ShowIcon: boolean = false;
    DateFormat: string = "yy-mm-dd";
    MinDate: Date = new Date("1/1/1000");
    MaxDate: Date = new Date("1/1/3000");
    ReadonlyInput: boolean = false;
    DisabledDates = "indalidDates"
    DisabledDays = [0, 6];
    MonthNavigator: boolean = true;
    YearNavigator: boolean = true;
    YearRange = "1000:3000"
    ShowTime: boolean = false;
    TimeOnly: boolean = false;
    SelectionMode: 'single' | 'multiple' | 'range' = 'single';
    ShowButtonBar: boolean = true;

    DateStart: number = 0;
    DateEnd: number = 0;
    ColorInDuration: string = "red"
    ColorOutDuration: string = "inherit"
    StyleSelect: string = "";

    NumberOfMonth: number = 1;
    View: 'date' | 'month' | 'year' = 'date';
    TochUI: boolean = true;
    InLine: boolean = true;
    ShowWeek: boolean = true;
}
