import { InputNumber, Sidebar, Table } from 'primeng-lts';
import { Dropdown } from 'primeng-lts/dropdown';
import { ConfigComboBox } from '../shared-models/config-combo-box';
import { DateTimeComponent } from '../Date-Time/DateTime.component';
import { Component, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { Cell, DataGridFilterMode, FilterColumnType, Row, column, dataGridConfig } from './Config.data.graid';
@Component({
  selector: 'app-dataGrid',
  templateUrl: './data.graid.component.html',
  styleUrls: ['./data.graid.component.css'],
})
export class dataGraidComponent {
  gridWidth = 0;
  sidebar: Sidebar
  oldScrollHight = ""
  SetBtnColorsOld = [];
  maxMize: boolean = false;
  compoBoxFilter: any = null;
  scrollable: boolean = false;
  startedView: boolean = false;
  numberSelectedShow: any = null;
  elementHeader: HTMLElement = null;
  elementScroll: HTMLElement = null;
  currentPageReportTemplate: string = "";
  @Output() addNew = new EventEmitter<any>();
  itemSourceColumns: Array<column<any>> = [];
  @Output() gridAction = new EventEmitter<any>();
  itemSourceSelectColumn: Array<column<any>> = [];
  @Output() childAddNew = new EventEmitter<any>();
  @Output() gridChildAction = new EventEmitter<any>();
  @ViewChild('table', { static: false }) BaseTable: Table
  @ViewChild('fixColumn', { static: false }) fixColumn: any
  @ViewChild('columnsElement', { static: false }) columnsElement: any
  @ViewChild('captionElement', { static: false }) captionElement: any
  ComboBox = new ConfigComboBox('اسم المكان', 'name', 'name', 'name')
  @ViewChild('fixColumnHeader', { static: false }) fixColumnHeader: any
  @Input() dataGriadConfig: dataGridConfig<any> = new dataGridConfig(this)
  constructor(private _render: Renderer2) {
  }
  ngAfterViewInit(): void {
    this.dataGriadConfig.baseComponent = this;
    this.dataGriadConfig.isLoading = true;
    setTimeout(() => {
      this.dataGriadConfig.isLoading = false;
      this.editStyleFixColumn();
      if (this.BaseTable != null || this.BaseTable != undefined) {
        this.BaseTable.onPageChange = (e) => {
          this.BaseTable.rows = e.rows;
          this.BaseTable.first = e.first;
          this.editStyleFixedRowWithTimer();
        }
      }
    }, 1000)
  }

  getLabelName(header: any, htmlTh: HTMLElement): string {
    htmlTh.setAttribute("rowspan", header.rowspan.toString())
    htmlTh.setAttribute("colspan", header.colspan.toString())
    return header.pathString;
  }



  EditShowValue(InputNumber: InputNumber, value, e) {
    setTimeout(() => {
      let htmlElement = InputNumber.el.nativeElement.children[0].children[0] as HTMLElement;
      htmlElement.style.transition = "all 1s;"
      if (InputNumber.value != value) {
        htmlElement.style.borderColor = "red"
        InputNumber.value = value;
        setTimeout(() => {
          htmlElement.style.borderColor = "#a6a6a6"
        }, 500)
      }
      else {
        htmlElement.style.borderColor = "#a6a6a6"
      }
    }, 400)
  }
  editStyleFixedRowWithTimer() {
    setTimeout(() => {
      this.editStyleFixColumn();
    }, 500)
  }
  ngAfterViewChecked() {
    this.editStyleFixColumn();
  }
  clearFilterByColor() {
    this.dataGriadConfig.Rows.filter(x => x["_F_C"] == false).forEach(row => {
      row.showRow = true;
    })
    this.SetBtnColorsOld.forEach(btn => {
      btn.classList.remove("btnFilterColorSelect")
    })
    this.dataGriadConfig.colorIndexFilterSelect = -2;
  }
  SetBtnColors(item, HTMLElement: HTMLElement) {
    if (!this.SetBtnColorsOld.includes(HTMLElement)) {
      if (this.dataGriadConfig.colorsFilterArray.indexOf(item) === this.dataGriadConfig.colorIndexFilterSelect) {
        this.filterByColor(item, HTMLElement);
      }
      else {
        HTMLElement.classList.remove("btnFilterColorSelect")
      }
      this.SetBtnColorsOld.push(HTMLElement)
    }
  }
  filterByColor(Select, HTMLElement: HTMLElement) {
    this.SetBtnColorsOld.forEach(btn => {
      btn.classList.remove("btnFilterColorSelect")
    })
    HTMLElement.classList.add("btnFilterColorSelect");
    this.dataGriadConfig.colorIndexFilterSelect = this.dataGriadConfig.colorsFilterArray.indexOf(Select);
    this.dataGriadConfig.Rows.forEach(row => {
      if (Select.id == row.idColorRow) {
        row.showRow = true;
        row["_F_C"] = true;
      } else {
        row.showRow = false;
        row["_F_C"] = false;
      }
    });
    this.editStyleFixedRowWithTimer();
  }
  LoadStyleTable(table: Table, _sidebar: any = null) {
    this.sidebar = _sidebar;
    this.itemSourceColumns = this.dataGriadConfig.columns;
    this.itemSourceSelectColumn = this.dataGriadConfig.columnShowOnly;
    let elementHeader: HTMLElement = undefined;
    let el1 = table.el.nativeElement.children[0] as HTMLElement;
    let elementScroll: HTMLElement = undefined
    if (el1 != undefined && el1 != null) {
      let el2 = el1.children[1];
      if (el2 != undefined && el2 != null) {
        let el3 = el2.children[0];
        if (el3 != undefined && el3 != null) {
          let el4 = el3.children[0];
          if (el4 != undefined && el4 != null) {
            let el5 = el4.children[0];
            elementHeader = el5 as HTMLElement
            if (elementHeader != null) {
              elementHeader.style.paddingLeft = "17px"
            }
          }
        }
      }
    }
    if (el1 != undefined && el1 != null) {
      let el2 = el1.children[1];
      if (el2 != undefined && el2 != null) {
        let el3 = el2.children[0];
        if (el3 != undefined && el3 != null) {
          let el4 = el3.children[1];
          elementScroll = el4 as HTMLElement;
        }
      }
    }

    this.gridWidth = this.dataGriadConfig.width;
    if (this.dataGriadConfig.ScrollHight != "0px") {
      this.scrollable = true;
    }
    else {
      this.scrollable = false;
    }
    if (this.elementScroll != null) {
      if (this.dataGriadConfig.GetItemSource().length == 0) {
        this.elementScroll.style.height = "30px";
      }
      else {
        this.elementScroll.style.height = "";
      }
    }
    if (this.elementScroll != null) {
      let realHightElementScroll: number = this.elementScroll.getBoundingClientRect().height;
      let inputHight: number = +this.dataGriadConfig.ScrollHight.replace('px', '').replace('%', '')
      if (realHightElementScroll >= inputHight) {
        this.elementScroll.style.marginRight = "17px"
      }
      else {
        this.elementScroll.style.marginRight = "0px"
      }
    }
    if (elementScroll !== undefined && elementScroll !== null) {
      this.elementScroll = elementScroll
      elementScroll.onscroll = (e: Event) => {
        e.preventDefault();
        elementHeader.style.marginRight = (elementScroll.scrollLeft) + "px"
        if (this.fixColumn != null) {
          let element = this.fixColumn.nativeElement as HTMLElement;
          element.scrollTop = elementScroll.scrollTop;
        }
      }
    }
  }
  editStyleRowCurdOperation(trElementCurd: HTMLElement, item) {
    if (item != null) {
      let row = item.__row as Row<any>;
      if (row != null) {
        trElementCurd.style.backgroundColor = row.background;
        trElementCurd.style.height = row.getHeightRow() + "px";
      }
    }

  }
  result: boolean = false;
  editShowValue(value: any): any {
    if (value != null && typeof value == "string") {
      if (value.includes("&")) {
        this.result = true;
        return ""
      }
      else {
        this.result = false;
        return value;
      }
    }
    else {
      this.result = false;
      return value;
    }
  }
  editStyleFixColumn() {
    if (this.columnsElement != null && this.fixColumn != null && this.fixColumnHeader != null && this.captionElement != null) {
      let HightSpace1 = this.captionElement.nativeElement.getBoundingClientRect().height;
      let HightSpace = this.columnsElement.nativeElement.getBoundingClientRect().height;
      this.fixColumnHeader.nativeElement.style.height = HightSpace + 1.5 + "px"
      this.fixColumnHeader.nativeElement.style.top = HightSpace1 + 31 + "px"
      this.fixColumn.nativeElement.style.top = HightSpace1 + HightSpace + 33 + "px"
      if (this.elementScroll != null) {

        if (this.elementScroll.children[0].getBoundingClientRect().width > this.elementScroll.getBoundingClientRect().width) {
          this.fixColumn.nativeElement.style.height = (this.elementScroll.getBoundingClientRect().height - 20) + "px"
        }
        else {
          this.fixColumn.nativeElement.style.height = (this.elementScroll.getBoundingClientRect().height - 3) + "px"
        }
      }
    }

  }
  selectExpend(item: any, st: boolean) {
    let row = item.__row as Row<any>
    if (this.dataGriadConfig.rowExpandMode == "single") row.configDataGrid.Rows.forEach(r => r.rowExpended = false)
    row.rowExpended = !st
    if (item.__row.rowExpended) {
      row.trElement.style.backgroundColor = "#0c88e94a"
    }
    this.editStyleFixedRowWithTimer();
  }
  upRow(row: Row<any>) {
    let upRow = this.dataGriadConfig.Rows.find(x => x.rowRank == row.rowRank - 1)
    if (upRow != undefined) {
      let swap = row.rowRank;
      row.rowRank = upRow.rowRank
      upRow.rowRank = swap;
    }
    this.editStyleFixedRowWithTimer();
  }
  downRow(row: Row<any>) {
    let downRow = this.dataGriadConfig.Rows.find(x => x.rowRank == row.rowRank + 1)
    if (downRow != undefined) {
      let swap = row.rowRank;
      row.rowRank = downRow.rowRank
      downRow.rowRank = swap;
    }
    this.editStyleFixedRowWithTimer();
  }
  upRowDouble(row: Row<any>) {
    let downRow = this.dataGriadConfig.GetItemSource()[0].__row
    if (downRow != undefined) {
      row.rowRank = downRow.rowRank - 1
    }
    this.editStyleFixedRowWithTimer();
  }
  downRowDouble(row: Row<any>) {
    let downRow = this.dataGriadConfig.GetItemSource()[this.dataGriadConfig.GetItemSource().length - 1].__row
    if (downRow != undefined) {
      row.rowRank = downRow.rowRank + 1
    }
    this.editStyleFixedRowWithTimer();
  }
  reOrderFresh() {
    this.dataGriadConfig.Rows.forEach((row) => {
      row.rowRank = row.rowIndex;
    })
    this.editStyleFixedRowWithTimer();
  }
  editStyleAndRelateElementToRow(elemnt: HTMLElement, index: number, item: any) {
    item.__row.trElement = elemnt; ''
    if (item.__row.selectRow) {
      item.__row.trElement.style.backgroundColor = "black"
      item.__row.trElement.style.color = "white"
    }
    else if (item.__row.rowExpended) {
      item.__row.trElement.style.backgroundColor = "#0c88e94a"
    }
    else {
      if (item.__row.hasError) {
        item.__row.trElement.style.backgroundColor = "red"
        item.__row.trElement.style.color = "white"
      }
      else {
        if (item.__row.idColorRow == -1) {
          item.__row.trElement.style.backgroundColor = index % 2 == 0 ? "white" : "#f4f4f4"
          item.__row.trElement.style.color = "black"
        }
        else {
          item.__row.trElement.style.backgroundColor = this.dataGriadConfig.colorsFilterArray.find(x => x.id == item.__row.idColorRow).color;
          item.__row.trElement.style.color = "black"
        }
      }
    }
    item.__row.background = item.__row.trElement.style.backgroundColor
  }
  endLading() {
  }
  doMaxMize() {
    if (this.maxMize) {
      this.maxMize = false
      this.dataGriadConfig.ScrollHight = this.oldScrollHight
    }
    else {
      this.maxMize = true;
      this.oldScrollHight = this.dataGriadConfig.ScrollHight
      let heightBarEl = this.sidebar.el.nativeElement as HTMLElement;
      this.dataGriadConfig.ScrollHight = (heightBarEl.getBoundingClientRect().height - 200) + "px";
    }
  }
  sendGridAction(event: any, type: string, row: any, column: any, rowIndex: number, cell: Cell<any> = null): void {
    let indexParent = null;
    if (this.dataGriadConfig.FatherChildDataGrid != null) {
      indexParent = this.dataGriadConfig.FatherChildDataGrid.GetItemSource().findIndex(x => x[this.dataGriadConfig.SubPropertyKey] == row)
    }
    this.dataGriadConfig.sendGridAction(event, type, row, column, rowIndex, cell, indexParent)
    this.gridAction.emit({ eventType: event, type: type, data: row, column: column, rowIndex: rowIndex, cell: cell, indexParent: indexParent });
  }
  AddNew() {
    this.dataGriadConfig.OnAddNewRow(true);
    this.addNew.emit(true);
  }
  ChildAddNew(rowData) {
    this.childAddNew.emit(rowData);
  }
  GridChildAction(eventChild, configDataGrid, parentRow) {
    this.gridChildAction.emit({ eventChild: eventChild, config: configDataGrid, parentRow: parentRow });
  }
  reFilter(table: Table, equal, column: column<any>, end: any, type = null) {
    if (this.dataGriadConfig.FilterMode == DataGridFilterMode.single) {
      // this.reFilterMode1(equal, column, end, type);
    }
    else {
      this.reFilterMode2(type, column, table)
    }
    this.editStyleFixedRowWithTimer();
  }
  reFilterMode1(equal, column: column<any>, end: any, type = null) {
    switch (column.FilterType) {
      case FilterColumnType.ComboBox:
        column.cells.forEach((cell) => {
          let vCell = cell.Value;
          if (vCell != null && column.ComboBoxConfig != null && equal != null) {
            if (vCell[column.ComboBoxConfig.optionLabel] == equal[column.ComboBoxConfig.optionLabel]) {
              cell.row.showRow = true
            }
            else {
              cell.row.showRow = false
            }
          }
          else {
            cell.row.showRow = false
          }
          if (equal == null) {
            cell.row.showRow = true
          }
        })
        break;
      case FilterColumnType.Text:
        equal = equal.target.value.toString()
        column.cells.forEach((cell) => {
          let vCell: string = cell.Value
          if (vCell != null && equal != null) {
            if (vCell.toLocaleLowerCase().includes(equal.toLocaleLowerCase())) {
              cell.row.showRow = true
            }
            else {
              cell.row.showRow = false
            }
          }
          if (equal == null) {
            cell.row.showRow = true
          }
        })
        break
      case FilterColumnType.CheckBox:
        equal = equal.value
        column.cells.forEach((cell) => {
          let vCell: boolean = cell.Value
          if (vCell != null && equal != null) {
            if (equal == vCell) {
              cell.row.showRow = true
            }
            else {
              cell.row.showRow = false
            }
          }

          if (equal == null) {
            cell.row.showRow = true
          }
        })
        break;
      case FilterColumnType.Number:

        let startV = 0;
        let endV = 0;
        if (type == "start") {
          if (end.value == "" || equal.value == "") {
            end.value = equal.value
          }
        }
        if (equal.value != "") {
          startV = +equal.value;
        }
        if (end.value != "") {
          endV = +end.value;
        }
        column.cells.forEach((cell) => {
          let vCell: number = cell.Value
          if (vCell != null) {
            if (vCell >= startV && vCell <= endV) {
              cell.row.showRow = true
            }
            else {
              cell.row.showRow = false
            }
          }
          if (equal.value == "") {
            cell.row.showRow = true
          }
        })
        break;
      case FilterColumnType.Date:

        let startDateC = equal as DateTimeComponent;
        let endDateC = end as DateTimeComponent;
        let startDate = startDateC.SelectDate;

        if (startDate != null) {
          startDate.setHours(0, 0, 0)
        }
        else {
          endDateC.SelectDate = null
        }
        let endDate = endDateC.SelectDate;
        if (endDate != null) endDate.setHours(23, 59, 59)
        if (type == "start") {
          if (startDate != null && endDate == null) {
            endDate = new Date(startDate)
            endDate.setHours(23, 59, 59)
            endDateC.SelectDate = endDate
          }
        }
        column.cells.forEach((cell) => {
          let vCell: Date = cell.Value
          if (vCell != null) {
            if (vCell >= startDate && vCell <= endDate) {
              cell.row.showRow = true
            }
            else {
              cell.row.showRow = false
            }
          }
          if (startDate == null) {
            cell.row.showRow = true
          }
        })
        break;
    }
  }
  reFilterMode2(type, column: column<any>, table: Table) {
    table.first = 0;
    this.dataGriadConfig.GetAllItemSource().forEach((item) => {
      if (item.__header != undefined) {
        return;
      }
      let decision = null;
      let stop = false;
      item.__row.cells.forEach((cell: Cell<any>) => {
        if (!stop) {
          let vCell: any = cell.Value
          let value = cell.column.filterElement
          switch (cell.column.FilterType) {
            case FilterColumnType.CheckBox:
              value = value.value;
              vCell = cell.Value
              if (value != null && value != undefined) {
                if (vCell != null && value != null) {
                  if (value == vCell) {
                    decision = true
                  }
                  else {
                    decision = false
                  }
                }
              }
              break;
            case FilterColumnType.ComboBox:
              let Dropdown = cell.column.filterElement.dropdown as Dropdown;
              if (Dropdown.value != null) {
                value = Dropdown.value
                vCell = cell.Value;
                if (vCell != null && cell.column.ComboBoxConfig != null && value != null) {
                  if (vCell[cell.column.ComboBoxConfig.optionLabel] == value[cell.column.ComboBoxConfig.optionLabel]) {
                    decision = true
                  }
                  else {
                    decision = false
                  }
                }
                else {
                  decision = false
                }
              }
              break;
            case FilterColumnType.Date:
              let startDateC = value.start as DateTimeComponent;
              let endDateC = value.end as DateTimeComponent;
              let startDate = startDateC.DateConfig.SelectedDate;
              let endDate = endDateC.DateConfig.SelectedDate;
              if (startDate != null) {
                startDate.setHours(0, 0, 0)
              }
              if (endDate != null) endDate.setHours(23, 59, 59)
              if (type == "start") {
                if (startDate != null && endDate == null) {
                  endDate = new Date(startDate)
                  endDate.setHours(23, 59, 59)
                  endDateC.DateConfig.SelectedDate = endDate;
                }
              }
              if (startDate == null) {
                endDateC.DateConfig.SelectedDate = null;
                endDate = null;
              }
              if (startDate != null) {
                value = cell.Value
                if (vCell != null) {
                  if (value >= startDate && value <= endDate) {
                    decision = true
                  }
                  else {
                    decision = false
                  }
                }
              }
              else {
                decision = true
              }


              break;
            case FilterColumnType.MaltiSelect:

              break;
            case FilterColumnType.Number:
              let startV = 0;
              let endV = 0;
              if (type == "start") {
                if (value.start.value == "" || value.end.value == "") {
                  value.end.value = value.start.value
                }
              }
              if (value.start.value != "") {
                startV = +value.start.value;
              }
              if (value.end.value != "") {
                endV = +value.end.value;
              }
              if (value.start.value != "") {
                vCell = cell.Value
                if (vCell != null) {
                  if (vCell >= startV && vCell <= endV) {
                    decision = true
                  }
                  else {
                    decision = false
                  }
                }
              }


              break;
            case FilterColumnType.Text:
              if (vCell != undefined) {
                vCell = cell.Value.toString()
                if (value.value != "") {
                  if (vCell != null && value.value != "") {
                    if (vCell.toLocaleLowerCase().includes(value.value.toLocaleLowerCase())) {
                      decision = true
                    }
                    else {
                      decision = false
                    }
                  }
                }
              }
              break;
          }
          if (decision == false) {
            stop = true;
          }
        }
      })
      if (decision == null) {
        item.__row.showRow = true;
      }
      else {
        item.__row.showRow = decision
      }
    })

  }
  relateFilterElementWithColumn(column: column<any>, input1, input2 = null) {
    if (input2 == null) {
      column.filterElement = input1;
    }
    else {
      column.filterElement = { start: input1, end: input2 }
    }
  }
  showColumn(columns: Array<any>) {
    this.itemSourceColumns.forEach(col_show => {
      if (columns.includes(col_show)) {
        col_show.showColumn = true;
        col_show.Width = col_show.OldWidth;
      }
      else {
        col_show.showColumn = false;
        col_show.OldWidth = col_show.Width;
        col_show.Width = 0;
      }

    })
    this.gridWidth = this.dataGriadConfig.width
    if (this.gridWidth < 200) {
      this.gridWidth = 200;
    }
  }

}