import { config } from "process";
import { Table } from "primeng-lts";
import { dataGraidComponent } from "./data.graid.component";
import { DateTimeConfig } from "../Date-Time/ConfigDateTime";
import { ConfigComboBox } from "../shared-models/config-combo-box";

export class dataGridConfig<T>{
    //تعريف الكمبونينت للداتا جريد
    constructor(Component: any) {
        column.IdClomn = -1;
        this.Component = Component;
    }
    baseComponent: dataGraidComponent = null;
    MaxRowHeight: string = "100%";
    //Header
    HeaderStyle = {
        backgroundHeaderClass: "",
        backgroundHeaderStyle: "",
        TextHeaderStyle: "",
        TextHeaderClass: "fa-2x",
        backgroundHeaderButtonClass: "",
        backgroundHeaderButtonStyle: "",
    }

    //Header Buttons configuration
    private _dataGridButtonHeaders: Array<dataGridButtonHeader> = [];
    public dataGridButtonHeaders(): Array<dataGridButtonHeader> {
        return this._dataGridButtonHeaders
    }
    AddHeaderButton(dataGridButtonHeader: dataGridButtonHeader) {
        dataGridButtonHeader.component = this.Component;
        this._dataGridButtonHeaders.push(dataGridButtonHeader)
    }

    GetFixedRows(table: Table): Array<any> {
        let rowsSelect = [];
        if (table != undefined) {
            let array = table._value;
            let dx = table._first;
            for (let index = 0; index < table._rows && dx < array.length; index++) {
                const element = array[dx];
                if (element != undefined) {
                    dx++
                    rowsSelect.push(element)
                }
            }
        }
        return rowsSelect;
    }
    colorsFilterArray = [];
    colorIndexFilterSelect = -1;
    public hasColumnWithMarge = [];
    public pathStringForCustomMarge
    //الصفوف المحددة من المستخدم
    private _SelectedRows: Array<any> = [];
    public set SelectedRows(v: Array<any>) {
        if (this.modeSelectedRow == 'multi') {
            this.Rows.forEach((row) => {
                row.selectRow = false;
            })
        }
        this._SelectedRows = v;
    }
    public get SelectedRows(): Array<any> {
        this._SelectedRows.forEach((item) => {
            let row = item.__row as Row<any>;
            row.selectRow = true;
        })
        return this._SelectedRows.filter(x => x.__row.showRow == true);
    }
    activeLoadingMode: boolean = false;
    private _isLoading: boolean = false;

    public set isLoading(v: boolean) {
        this._isLoading = v;
    }

    public get isLoading(): boolean {
        if (this.activeLoadingMode) {

            return this._isLoading
        }
        else return false
    }

    modeSelectedRow: 'single' | 'multi' = 'single'
    maxMize: boolean = false
    dataKey: string = "id";
    header: string = "";
    visible: boolean = true;
    ScrollHight: string = "0px";
    WidthDataGrid: string = "auto"
    public get globalFilterFields(): Array<string> {
        let result: Array<string> = [];
        this.columns.filter(x => x.Type !== ColumnType.Image && x.Type !== ColumnType.CheckBox).forEach(c => {
            result.push(c.Name)
        })
        return result
    }
    public get scrollable(): boolean {
        if (this.ScrollHight == "0px") {
            return false;
        }
        return true
    }
    // عدد الصفوص الظاهرة
    RowsCount: number = 10;
    // تقسيمات عدد الصفوف
    rowsPerPageOptions: number[] = [3, 5, 10, 20];
    public get Rows_Show(): number {
        return this.RowsCount
    }
    public get Paginator(): boolean {
        if (this.Rows_Show > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    // الجملة التعريفية بالداتا جريد
    footer: string = "";
    ReportName: string = "";
    // مصدر البيانات للداتا جريد
    private _ItemSource: Array<any> = [];
    private nativeItemSource = [];
    public set ItemSource(ItemSource: Array<T>) {
        this.isLoading = true;
        this.Rows = [];
        this.columns.forEach(c => c.cells = []);
        this.nativeItemSource = ItemSource;
        this._SelectedRows = [];
        this.renderSource(ItemSource, true)
        if (ItemSource != null) {
            ItemSource.forEach((item, itemIndex) => {
                let nRow: Row<T> = new Row(this);
                this.ReSetSourceDataGrid(item);
                if (item["__row"] != undefined) {
                    let oldRow = item["__row"] as Row<any>
                    nRow.rowExpended = oldRow.rowExpended;
                    nRow.selectRow = oldRow.selectRow;
                    nRow.hasError = oldRow.hasError
                }
                nRow.itemValue = item;
                nRow.rowIndex = itemIndex;
                nRow.rowRank = itemIndex;
                this.columnShowOnly.forEach((column) => {
                    let nCell = new Cell<any>()
                    nCell.column = column;
                    nCell.ConfigComboBox = column.ComboBoxConfig;
                    nCell.row = nRow;
                    nCell.rowIndex = itemIndex;
                    column.cells.push(nCell);
                    nRow.cells.push(nCell);
                })
                this.Rows.push(nRow);
                this.renderItemSource(item, itemIndex)
            })
            this._ItemSource = ItemSource;
            if (this.baseComponent != null) {
                setTimeout(() => {
                    this.baseComponent.editStyleFixColumn();
                    this.isLoading = false;
                }, 1000)
            }
        }
    }
    public GetItemSource(): Array<any> {
        return this._ItemSource.filter(X => X.__row != undefined && X.__row.showRow == true).sort((n1, n2) => { return n1.__row.rowRank - n2.__row.rowRank })
    }
    public GetAllItemSource(): Array<any> {
        return this._ItemSource
    }
    pushNewItem(item: T) {
        this.nativeItemSource.push(item)
        this._SelectedRows = [];
        let nRow: Row<T> = new Row(this);
        nRow.itemValue = item;
        this.ReSetSourceDataGrid(item);
        nRow.rowIndex = this._ItemSource.length;
        nRow.rowRank = this._ItemSource.length;
        nRow.configDataGrid = this
        this.columnShowOnly.forEach((column) => {
            let nCell = new Cell<T>()
            nCell.column = column;
            nCell.ConfigComboBox = column.ComboBoxConfig;
            nCell.row = nRow;
            nCell.rowIndex = this._ItemSource.length;
            column.cells.push(nCell);
            nRow.cells.push(nCell);
        })
        this.renderItemSource(item, this._ItemSource.length)
        this._ItemSource.push(item)
        this.renderSource(this._ItemSource, false)
    }
    public sendGridAction(event: any, type: string, row: any, column: any, rowIndex: number, cell: Cell<any> = null, indexParent = null) {

    }
    public OnAddNewRow(e: boolean = true) {

    }
    public Update() {

    }
    public renderItemSource(row: T, rowIndex: number) {

    }
    public renderSource(NewItemSource: Array<T>, fromSource) {

    }
    // اضافة جديد
    AllowAddNew: boolean = false;
    //  السماح بالتعديل و الاضافة و  والعرض والحذف 
    CanCurdOperation: boolean = false;
    CustomButtonsInCanCurdOperation = [];
    public get CanCurdOperationWidth(): number {
        let width = 50;
        if (this.AllowAddInherit) {
            width += 80;
        }
        if (this.AllowDelete) {
            width += 80;
        }
        if (this.AllowView) {
            width += 80;
        }
        if (this.AllowEdit) {
            width += 80;
        }
        if (this.CustomButtonsInCanCurdOperation.length > 0) {
            this.CustomButtonsInCanCurdOperation.forEach(btn => width += btn.width)
        }
        return width;
    }
    rowExpandMode: "single" | "multiple" = "multiple"
    CanShowSelectorColumns: boolean = false;
    frozenColumns = [];
    // السماح بالعرض
    AllowView: boolean = false;
    // السماح بالتعديل
    AllowEdit: boolean = false;
    // السماح بالحذف
    AllowDelete: boolean = false;
    // اضافة جديد بنفس البيانات
    AllowAddInherit: boolean = false;
    // السماح بتصدير البيانات
    CanExportExcel: boolean = false;
    nameReport: string = "";
    // السماح بالبحث 
    CanFilterGlobal: boolean = true;
    CanSelectAllRow: boolean = false;
    CanReOrder: boolean = false;
    FilterMode: DataGridFilterMode = DataGridFilterMode.multi;
    //#region تكوين عناصر الداتا جريد
    // تعريف عماويد الداتا جريد
    columns: Array<column<T>> = [];
    public get columnShowOnly(): Array<column<T>> {
        return this.columns.filter(x => x.showColumn == true && x.visible == true)
    }
    //صفوف الجريد
    Rows: Array<Row<T>> = [];
    MyTable: Table
    private _disabled: boolean
    public get disabled(): boolean {
        return this._disabled
    }
    public set disabled(v: boolean) {
        this._disabled = v;
        this.Rows.forEach((row) => {
            row.disable = v;
        })
    }

    //#endregion


    //#region  childGrid

    SubPropertyKey: string = "";
    FatherChildDataGrid: dataGridConfig<any> = null;
    private _ChildConfigs: Array<dataGridConfig<any>> = [];
    public get dataGridChildren(): Array<dataGridConfig<any>> {

        return this._ChildConfigs;
    }
    public set dataGridChildren(ChildConfigs: Array<dataGridConfig<any>>) {
        this._ChildConfigs = ChildConfigs;
        this._ChildConfigs.forEach(item => {
            item.FatherChildDataGrid = this;
        })
    }
    public ReSetSourceDataGrid(item: T) {
        this.dataGridChildren.forEach((dgv, index) => {
            //copy Data Grid to Rows
            if (item[dgv.SubPropertyKey] != undefined) {
                let nChildDataGrid = new dataGridConfig<any>(this.Component);
                if (item[`__DataConfig__${index}`] != undefined) {
                    nChildDataGrid = item[`__DataConfig__${index}`]
                }
                nChildDataGrid.AllowAddInherit = dgv.AllowAddInherit;
                nChildDataGrid.CanFilterGlobal = dgv.CanFilterGlobal;
                nChildDataGrid.AllowAddNew = dgv.AllowAddNew;
                nChildDataGrid.ScrollHight = dgv.ScrollHight;
                nChildDataGrid.FilterMode = dgv.FilterMode;
                nChildDataGrid.WidthDataGrid = dgv.WidthDataGrid;
                nChildDataGrid.AllowDelete = dgv.AllowDelete;
                nChildDataGrid.AllowEdit = dgv.AllowEdit;
                nChildDataGrid.CanCurdOperation = dgv.CanCurdOperation;
                nChildDataGrid.CanExportExcel = dgv.CanExportExcel;
                nChildDataGrid.CanReOrder = dgv.CanReOrder;
                nChildDataGrid.visible = dgv.visible;
                nChildDataGrid.modeSelectedRow = dgv.modeSelectedRow;
                nChildDataGrid.AllowView = dgv.AllowView;
                nChildDataGrid.CanSelectAllRow = dgv.CanSelectAllRow;
                nChildDataGrid._ChildConfigs = dgv._ChildConfigs;
                nChildDataGrid.columns = dgv.columns;
                nChildDataGrid.RowsCount = dgv.RowsCount;
                nChildDataGrid.SubPropertyKey = dgv.SubPropertyKey;
                nChildDataGrid.dataKey = dgv.dataKey;
                nChildDataGrid.dataGridChildren = dgv.dataGridChildren;
                nChildDataGrid.FatherChildDataGrid = dgv.FatherChildDataGrid;
                nChildDataGrid.ReportName = dgv.ReportName;
                nChildDataGrid.SelectedRows = dgv.SelectedRows;
                nChildDataGrid.footer = dgv.footer;
                nChildDataGrid.header = dgv.header;
                nChildDataGrid.maxMize = dgv.maxMize;
                nChildDataGrid.rowsPerPageOptions = dgv.rowsPerPageOptions;
                nChildDataGrid.ItemSource = item[nChildDataGrid.SubPropertyKey];
                if (item[`__DataConfig__${index}`] == undefined) {
                    Object.defineProperty(item, `__DataConfig__${index}`, {
                        value: nChildDataGrid,
                        writable: true,
                    })
                }
                else {
                    item[`__DataConfig__${index}`] = nChildDataGrid
                }
            }

        })

    }

    //#endregion




    //#region تعديل عرض العمود

    // خاصة بتحديد العمود المراد تعديل عرضة
    EditWidthColumnSelect: column<T> = null;
    private start: number = 0;
    private end: number = 0;
    private actevClick = false;
    //عرض الداتا جريد
    public get width(): number {

        let fullWidth = 0;
        this.columnShowOnly.forEach(col => {
            fullWidth += col.Width;
        })
        this.CanCurdOperation ? fullWidth += 200 : ''
        let additionWidth = 0;
        if (this.CanCurdOperation) {
            additionWidth += 250;
        }
        if (this.CanSelectAllRow) {
            additionWidth += 50;
        }
        if (this.dataGridChildren.length > 0) {
            additionWidth += 70;
        }
        if (this.CanReOrder) {
            additionWidth += 50;
        }
        return fullWidth + additionWidth;
    }

    mousUpResizeSelect(Realscreen: HTMLElement) {
        this.actevClick = false;
        this.ControlSelectText(Realscreen, false);
        if (this.end == 0) {
            this.end = this.start;
        }
        let diffrent = this.start - this.end;

        if (this.EditWidthColumnSelect != null) {
            this.EditWidthColumnSelect.Width -= diffrent;
            this.EditWidthColumnSelect = null;
        }

        if (this.line != null) {
            this.line.remove();
        }
    }

    TargetResize(tr: column<T>) {
        this.EditWidthColumnSelect = tr;
    }

    mousDowinResizeSelect(event: MouseEvent, Realscreen: HTMLElement) {
        this.actevClick = true;
        this.ControlSelectText(Realscreen);
        this.ApandLine(Realscreen.getBoundingClientRect().height, Realscreen);
        this.start = this.CulCResize(event, Realscreen);
    }

    mousMoveResizeSelect(event: MouseEvent, Realscreen: HTMLElement) {
        event.preventDefault();
        if (this.actevClick == true) {
            this.end = this.CulCResize(event, Realscreen);
        }

    }

    private CulCResize(event: MouseEvent, Realscreen: HTMLElement): number {
        let widthScreen = document.body.getBoundingClientRect().width;
        let realRight = widthScreen - Realscreen.getBoundingClientRect().right;
        let revclientX = widthScreen - (event.clientX + realRight);
        let result = revclientX;
        this.line.style.left = (event.clientX) + "px"
        return (result - realRight);
    }
    line: HTMLElement;
    private ApandLine(height: number, Realscreen: HTMLElement) {
        let div = document.createElement('div');
        let appRoot = document.getElementsByTagName("app-root").item(0) as HTMLElement
        height = document.body.getBoundingClientRect().height
        div.style.width = "2px"
        div.style.position = "absolute";
        div.style.zIndex = "1000000";
        div.style.top = "0px"
        // div.style.bottom = "0px"
        div.style.backgroundColor = "blue"
        div.style.height = appRoot.getBoundingClientRect().height + "px"
        div.style.cursor = "col-resize"
        this.line = div;
        div.addEventListener("mouseup", (e) => {
            if (this.end == 0) {
                this.end = this.start;
            }
            let diffrent = this.start - this.end;

            if (this.EditWidthColumnSelect != null) {
                this.EditWidthColumnSelect.Width -= diffrent;
                this.EditWidthColumnSelect = null;
            }
            this.actevClick = false;
            if (this.line != null) {
                this.ControlSelectText(Realscreen);
                this.line.remove();
            }
        })
        document.body.appendChild(this.line)
    }


    private ControlSelectText(Element: HTMLElement, open: boolean = true) {

        if (open) {
            Element.style.webkitUserSelect = "none"
            Element.style.userSelect = "none"
        }
        else {
            Element.style.webkitUserSelect = ""
            Element.style.userSelect = ""
        }
    }
    //#endregion


    //#region Custom Data Bind
    // الكمونانت الموجود بة الجريد
    Component: any = null;
    GenratCustomObject(element: HTMLElement, column: column<T>, item: T, index: number) {
        if (column.objectCustom != null && column.Type == ColumnType.Element) {
            let nameObject = "";
            if (column.Name == "") {
                nameObject = column.objectCustom?.NgModelCustom?.NameValue;
            }
            else {
                nameObject = column.Name;
            }
            if (element.innerHTML != "") {
                let elms = document.querySelectorAll(`[IdForRelate]`)
                elms.forEach((element: any) => {
                    if (element.setAtr === `${nameObject}_${index}`) {
                        element.value = item[nameObject]

                        if (element.type == "checkbox") {
                            element.checked = item[nameObject]
                        }



                        /// event
                        ///
                    }
                })
                return
            }

            element.innerHTML = column.objectCustom.interHtml;
            let custom = element.children[0] as HTMLElement;
            let nCustom = custom as any
            if (item[nameObject] != undefined) {
                nCustom.setAtr = `${nameObject}_${index}`

                custom.setAttribute("IdForRelate", "")
                if (nCustom.type != "-") {
                    nCustom.value = item[nameObject]
                    nCustom.addEventListener("input", (E) => {
                        let ngModelChange = column.objectCustom.events.find(x => x.eventType.toLowerCase() == "ngModelChange".toLowerCase())
                        let el = E.target as any;
                        let oldValue = item[nameObject]
                        item[nameObject] = el.value
                        if (nCustom.type == "checkbox") {
                            item[nameObject] = !el.checked
                        }
                        if (ngModelChange != null) {
                            let addEvent = -1;
                            let functionGet = this.Component[ngModelChange.methodName];
                            if (typeof functionGet === "function") {
                                ngModelChange.prames.forEach((pram: string, index) => {
                                    if (this.Component[pram] != null) {
                                        ngModelChange.prames[index] = this.Component[pram] as any;
                                    }
                                    if (pram == "$event") {
                                        ngModelChange.prames[index] = { itemTarget: item, propertyName: nameObject, oldValue: oldValue, newValue: item[nameObject] } as any;
                                        if (nCustom.type == "number") {
                                            ngModelChange.prames[index] = { itemTarget: item, propertyName: nameObject, oldValue: +oldValue, newValue: +item[nameObject] } as any;
                                        }
                                        addEvent = index;
                                    }
                                })
                                this.Component[ngModelChange.methodName](...ngModelChange.prames);
                                if (addEvent != -1) {
                                    ngModelChange.prames[addEvent] = "$event"
                                    addEvent = -1;
                                }
                            }
                        }
                        let elms = document.querySelectorAll(`[IdForRelate]`)
                        elms.forEach((element: any) => {
                            if (element.setAtr === el.setAtr) {
                                element.value = el.value
                            }
                        })

                    })
                }

            }
            let events = column.objectCustom.events;
            events.filter(x => x.eventType.toLowerCase() != "ngModelChange".toLowerCase()).forEach(ev => {
                let functionGet = this.Component[ev.methodName];
                if (typeof functionGet === "function") {
                    ev.prames.forEach((pram: string, index) => {
                        if (this.Component[pram] != null) {
                            ev.prames[index] = this.Component[pram] as any;
                        }
                    })
                    let setterAtr = custom as any;
                    setterAtr.itemSelect = item
                    custom.addEventListener(ev.eventType, (e: any) => {
                        let addEvent = -1;
                        ev.prames.forEach((pram: string, index) => {
                            if (pram == "$event") {
                                ev.prames[index] = e
                                addEvent = index;
                            }
                        })
                        this.Component[ev.methodName](...ev.prames);
                        if (addEvent != -1) {
                            ev.prames[addEvent] = "$event"
                            addEvent = -1;
                        }
                    });

                }
            })

        }
    }
    //#endregion



    //#region عمليات خاصة بالداتا جريد
    SearchControl(textSearch: any, column: column<T> = null) {
        let words = textSearch.value as string;
        if (words != "") {
            this.Rows.forEach(row => {
                row.showRow = false
                if (column == null) {
                    this.search(words, row.cells)
                }
            })
        }
        else {
            this.Rows.forEach(row => {
                row.showRow = true;
            })
        }
        this.baseComponent.editStyleFixedRowWithTimer();
    }
    private search(search: string, cells: Array<Cell<T>>, culumnSerched: column<T> = null) {
        cells.filter(x => x.column.FilterType == FilterColumnType.Text || x.column.FilterType == FilterColumnType.Number || x.column.FilterType == FilterColumnType.Date).forEach(cell => {
            let vl = cell.Value
            if (vl != null && vl != undefined) {
                if (vl.toString().toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
                    cell.row.showRow = true;
                }
            }
        })
    }
    exportExcel(): void {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.nativeItemSource);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, this.nameReport);
        });
    }
    saveAsExcelFile(buffer: any, fileName: string): void {
        import("file-saver").then(FileSaver => {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data: Blob = new Blob([buffer], {
                type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
        });
    }
    //#endregion




}

export class column<T> {
    static IdClomn = -1;
    showColumn: boolean = true;
    filterElement: any = null;
    idElementFilter: string = "";
    DateConfig: any = new DateTimeConfig();
    DateConfigFilterStart: DateTimeConfig = new DateTimeConfig(null);
    DateConfigFilterEnd: DateTimeConfig = new DateTimeConfig(null);
    index: number = -1;
    Name: string = "";
    Header: string = "";
    ItemsSelectedSource: Array<any> = [];
    canFilter: boolean = true;
    canSort: boolean = true;
    canSelectAll: boolean = true;

    private _visible: boolean = true;
    public set visible(v: boolean) {
        this._visible = v;
        this.cells.forEach(cell => {
            cell.visible = v;
        })
    }
    public get visible(): boolean {
        return this._visible
    }

    private _disable: boolean = false;
    public set disable(v: boolean) {
        this._disable = v;
        this.cells.forEach(cell => {
            cell.disable = v;
        })
    }
    public get disable(): boolean {
        return this._disable
    }
    private _Width: number = 120;
    OldWidth: number = 120;
    public get Width(): number {
        switch (this.Type) {
            case ColumnType.Label:
                if (this._Width < 120) return 120;
                break;
            case ColumnType.Text:
                if (this._Width < 120) return 120;
                break;
            case ColumnType.Number:
                if (this._Width < 120) return 120;
                break;
            case ColumnType.Date:
                if (this._Width < 200) return 200;
                break;
            case ColumnType.ComboBox:
                if (this._Width < 100) return 100;
                break;
            case ColumnType.TextAria:
                if (this._Width < 200) return 200;
                break;
            case ColumnType.CheckBox:
                if (this._Width < 120) return 120;
                break;
            case ColumnType.Password:
                if (this._Width < 120) return 120;
                break;
            case ColumnType.telephon:
                if (this._Width < 120) return 120;
                break;
            case ColumnType.Email:
                if (this._Width < 120) return 120;
                break;
            case ColumnType.Element:
                if (this._Width < 120) return 120;
                break;
            case ColumnType.Button:
                if (this._Width < 80) return 80;
                break;
            case ColumnType.File:
                if (this._Width < 100) return 100;
                break;
            case ColumnType.Image:
                if (this._Width < 100) return 100;
                break;
        }
        return this._Width
    }
    public set Width(width: number) {
        this._Width = width;
    }
    cells: Cell<T>[] = [];
    selectAllValue(value: any) {
        this.cells.forEach(x => x.Value = value.checked)
    }
    private _Type: ColumnType = ColumnType.Text

    public get Type(): ColumnType {
        return this._Type;
    }
    public stopAllFilter: boolean = false;
    public set Type(v: ColumnType) {
        switch (v) {
            case ColumnType.Text:
                this.FilterType = FilterColumnType.Text
                break;
            case ColumnType.Number:
                this.FilterType = FilterColumnType.Number
                break;
            case ColumnType.Date:
                this.FilterType = FilterColumnType.Date
                break;
            case ColumnType.ComboBox:
                this.FilterType = FilterColumnType.ComboBox
                break;
            case ColumnType.TextAria:
                this.FilterType = FilterColumnType.Text
                break;
            case ColumnType.CheckBox:
                this.FilterType = FilterColumnType.CheckBox
                break;
            case ColumnType.Password:
                this.FilterType = FilterColumnType.Text
                break;
            case ColumnType.telephon:
                this.FilterType = FilterColumnType.Text
                break;
            case ColumnType.Email:
                this.FilterType = FilterColumnType.Text
                break;
            case ColumnType.Element:
                this.FilterType = null
                break;
            case ColumnType.Button:
                this.FilterType = null
                break;
            case ColumnType.File:
                this.FilterType = null
                break;
            case ColumnType.Image:
                this.FilterType = null
                this.canSort = false;
                break;
        }
        this._Type = v;
    }
    private _FilterType: FilterColumnType = FilterColumnType.Text
    public set FilterType(FilterType: FilterColumnType) {
        this._FilterType = FilterType;
    }

    public get FilterType(): FilterColumnType {
        if (this.stopAllFilter) {
            this.FilterType = FilterColumnType.None
        }
        return this._FilterType
    }
    objectCustom: ObjectCustom = null;
    ComboBoxConfig: ConfigComboBox = new ConfigComboBox("", "", "", "")
    buttonConfig = {
        class: "",
        style: ""
    };
    private GetActionEvents(Html: string) {
        let obj: ObjectCustom = new ObjectCustom();
        const regex = /\[\(ngModel\)]="(.+?)"/
        const match = Html.match(regex)
        if (match) {
            obj.NgModelCustom = new NgModelCustom(match[1])
            Html = Html.replace(match[0], "")
        }
        obj.interHtml = Html;
        let patternGetActions: RegExp = /\((.*?)\)="([^"]*)"/g
        let Action = null;
        while ((Action = patternGetActions.exec(Html)) != null) {
            let ev: EventsCustom = new EventsCustom()
            let patternGetparames: RegExp = /\((.*?)\)/g;
            let parametext = null;
            while ((parametext = patternGetparames.exec(Action[2])) != null) {
                if (parametext[1].includes(",")) {
                    let st = parametext[1] as string;
                    let Arrays = st.match(/\[[^\[\]]*\]/g)
                    if (Arrays != null) {
                        Arrays.forEach((item) => {
                            ev.prames.push(item)
                            st = st.replace(item, '');
                        })
                    }
                    let prams = st.split(',') as Array<any>;
                    prams.forEach(pr => {
                        if (pr != "") {
                            ev.prames.push(pr)
                        }
                    })
                }
                else {
                    let pram = parametext[1];
                    ev.prames.push(pram)
                }
            }
            let func = Action[2].split('(')[0];
            ev.methodName = func;
            let typEvent = Action[1];
            ev.eventType = typEvent;
            ev.prames.forEach((pram: string, index) => {
                if (pram.includes(`'`)) {
                    let pramN = pram.slice(1, pram.length - 1);
                    ev.prames[index] = pramN as string;
                }
                else if (pram == "true") {
                    ev.prames[index] = true;
                }
                else if (pram == "false") {
                    ev.prames[index] = false;
                }
                else if (!Number.isNaN(Number(pram))) {
                    ev.prames[index] = Number(pram);
                }
                else if (pram.includes(`[`) && pram.includes(`]`)) {
                    ev.prames[index] = JSON.parse(pram)
                }
            })
            obj.events.push(ev)
        }
        this.objectCustom = obj;
    }
    constructor(name: string = "", header: string = "", Type: ColumnType = ColumnType.Text, Config: any = null, width: number = 120, FilterType: FilterColumnType = FilterColumnType.Text) {
        this.Name = name;
        this.Header = header;
        this.Type = Type;
        if (FilterType != null) {
            this.FilterType = FilterType
        }
        else {
            this.FilterType = FilterColumnType.None;
        }
        if (Config != null) {
            if (Type === ColumnType.ComboBox) {
                this.ComboBoxConfig = Config as ConfigComboBox;
                this.ComboBoxConfig.showClear = true;
                this.canSort = false;
            }
            if (Type === ColumnType.Element) {
                this.GetActionEvents(Config as string)
            }
            if (Type === ColumnType.Button) {
                this.buttonConfig = Config
            }
            if (Type == ColumnType.Date) {
                if (typeof (this.DateConfig) === typeof (DateTimeConfig)) {
                    this.DateConfig = config;
                }
            }
        }
        this.Width = width;
        column.IdClomn++;
        this.index = column.IdClomn;
    }
}
export class Row<T>{
    constructor(_dataGridConfig: dataGridConfig<any>) {
        this.configDataGrid = _dataGridConfig;
        this.AllowView = this.configDataGrid.AllowView;
        this.AllowAddInherit = this.configDataGrid.AllowAddInherit;
        this.AllowEdit = this.configDataGrid.AllowEdit;
        this.AllowDelete = this.configDataGrid.AllowDelete;
        this.configDataGrid.CustomButtonsInCanCurdOperation.forEach(btn => {
            this.CanCurdOperationWidth.push({ class: btn.class, style: btn.style, Header: btn.Header, visible: btn.visible, width: btn.width });
        })
        this.MaxRowHeight = this.configDataGrid.MaxRowHeight;
    }
    MaxRowHeight = "100px";
    idColorRow: number = -1;
    hasError: boolean = false;
    configDataGrid: dataGridConfig<any> = null
    rowExpended: boolean = false;
    AllowView: boolean = false;
    AllowAddInherit: boolean = false;
    AllowEdit: boolean = false;
    AllowDelete: boolean = false;
    CanCurdOperationWidth = [];
    background: string = "";
    rowIndex: number = -1;
    rowRank: number = -1;
    getHeightRow() {
        if (this.trElement != null) {
            return this.trElement.getBoundingClientRect().height
        }
        return 0;
    }
    showRow: boolean = true;
    private _itemValue: any = null;
    public set itemValue(v: any) {
        this._itemValue = v;
        this._itemValue.__row = this
    }
    public get itemValue(): any {
        return this._itemValue;
    }
    visible: boolean = true;
    private _selectRow: boolean = false;

    public get selectRow(): boolean {
        return this._selectRow
    }

    public set selectRow(v: boolean) {

        if (this.configDataGrid.modeSelectedRow == 'single') {
            this.configDataGrid.Rows.forEach(row => {
                row._selectRow = false;
            })
            this._selectRow = v;
        }
        else {
            this._selectRow = v;
        }
    }

    private _disable: boolean = false;
    public set disable(v: boolean) {
        this._disable = v;
        this.cells.forEach(cell => {
            cell.disable = v;
        })
    }
    public get disable(): boolean {
        return this._disable
    }


    cells: Array<Cell<T>> = [];
    private _trElement: HTMLElement = null;
    public set trElement(v: HTMLElement) {
        this._trElement = v;
    }
    public get trElement(): HTMLElement {
        return this._trElement
    }
    filtersBy: Array<column<T>> = [];

}
export class Cell<T> {
    buttons = [];
    rowIndex: number = -1;
    column: column<T> = null;
    loadCell: boolean = false;
    nameSource: string = null;
    showAsDateWithFormate: string = "";
    private _ConfigComboBox: ConfigComboBox = null;
    public set ConfigComboBox(v: ConfigComboBox) {
        let nconf = new ConfigComboBox(v.placeholder, v.optionLabel, v.filterBy);
        nconf.ItemSource = v.ItemSource;
        nconf.ClearActive = false;
        nconf.appendTo = 'body'
        this._ConfigComboBox = nconf;
    }

    public get ConfigComboBox(): ConfigComboBox {
        this._ConfigComboBox.SelectedValue = this.Value;
        return this._ConfigComboBox;
    }

    private _type: ColumnType = null;
    public set Type(v: ColumnType) {
        this._type = v;
    }
    public get Type(): ColumnType {
        if (this._type == null) {
            return this.column.Type;
        }
        else {
            return this._type;
        }
    }
    row: Row<any> = null;
    oldValue: any = null;
    public set Value(v: any) {
        this.oldValue = this.Value
        let cName = this.column.Name;
        if (this.nameSource != null) {
            cName = this.nameSource;
        }
        if (cName.includes('.')) {
            let arrProp = this.column.Name.split('.');
            let prEnd = null;
            arrProp.forEach((stepProp, index) => {
                if (arrProp.length - 1 == index) {

                    prEnd[stepProp] = v
                }
                if (index == 0) {
                    if (stepProp.includes('[')) {
                        let match = /\[(\d+)\]/g
                        let posNumberSt = stepProp.match(match)[0];
                        stepProp = stepProp.replace(posNumberSt, '');
                        prEnd = this.row.itemValue[stepProp][+posNumberSt.replace(']', '').replace('[', '')]
                    }
                    else {
                        prEnd = this.row.itemValue[stepProp]
                    }
                }
                else {
                    if (stepProp.includes('[')) {
                        let match = /\[(\d+)\]/g
                        let posNumberSt = stepProp.match(match)[0];
                        stepProp = stepProp.replace(posNumberSt, '');
                        prEnd = prEnd[stepProp][+posNumberSt.replace(']', '').replace('[', '')]
                    }
                    else {
                        prEnd = prEnd[stepProp]
                    }
                }
            })

        }
        else {
            this.row.itemValue[cName] = v;
        }

    }
    public get Value(): any {
        let cName = this.column.Name;
        if (this.nameSource != null) {
            cName = this.nameSource;
        }
        if (cName.includes('.')) {
            let arrProp = cName.split('.');
            let prEnd = null;
            arrProp.forEach((stepProp, index) => {
                if (index == 0) {
                    if (stepProp.includes('[')) {
                        let match = /\[(\d+)\]/g
                        let posNumberSt = stepProp.match(match)[0];
                        stepProp = stepProp.replace(posNumberSt, '');
                        prEnd = this.row.itemValue[stepProp][+posNumberSt.replace(']', '').replace('[', '')]
                    }
                    else {

                        if (this.row.itemValue[stepProp] != undefined) {
                            prEnd = this.row.itemValue[stepProp]
                        }
                        else {
                            prEnd = null;
                        }
                    }
                }
                else {
                    if (stepProp.includes('[')) {
                        let match = /\[(\d+)\]/g
                        let posNumberSt = stepProp.match(match)[0];
                        stepProp = stepProp.replace(posNumberSt, '');
                        prEnd = prEnd[stepProp][+posNumberSt.replace(']', '').replace('[', '')]
                    }
                    else {
                        if (prEnd[stepProp] != undefined) {
                            prEnd = prEnd[stepProp]
                        }
                        else {
                            prEnd = null;
                        }
                    }
                }
            })
            if (prEnd == undefined) {
                prEnd = null;
            }

            return prEnd;
        }
        else {
            if (this.row.itemValue[cName] == undefined) {
                this.row.itemValue[cName] = null;
            }
            return this.row.itemValue[cName]
        }
    }
    visible: boolean = true;
    disable: boolean = false;
    public get valueCell(): any {
        if (this.Value != undefined) {
            return this.Value[this.column.Name]
        }
        else {
            return null;
        }
    }
}

export class ObjectCustom {
    interHtml: string = "";
    events: Array<EventsCustom> = [];
    NgModelCustom: NgModelCustom = null;
}
export class NgModelCustom {
    NameValue: string = "";
    typeElement: string = "";

    constructor(_NameValue: string = "", _typeElement: string = "") {
        this.typeElement = _typeElement;
        this.NameValue = _NameValue;
    }
}
export class EventsCustom {
    methodName: string = "";
    eventType: string = "";
    prames: Array<any> = [];
}
export enum ColumnType {
    Text = "text",
    Label = "lable",
    ComboBox = "comboBox",
    CheckBox = "checkbox",
    Button = "button",
    Buttons = "buttons",
    Date = "date",
    Email = "email",
    File = "file",
    Number = "number",
    Password = "password",
    telephon = "tel",
    Image = "image",
    TextAria = "textarea",
    Element = "Element",
}
export enum FilterColumnType {
    Text = 1,
    ComboBox = 2,
    CheckBox = 3,
    Date = 4,
    Number = 5,
    MaltiSelect = 6,
    None = 7
}
export enum DataGridFilterMode {
    single = 1,
    multi = 2
}

export class dataGridButtonHeader {
    constructor(Header: string = "", classText: string = "", styleText: string = "", Events: Array<dataGridEvent>) {
        this.Events = Events;
        this.styleText = styleText;
        this.classText = classText;
        this.Header = Header;
    }
    component: any = null;
    buttonElement: any = null;
    classText: string = "";
    styleText: string = "";
    Header: string = "";
    Events: Array<dataGridEvent>
    setEvents(buttonElement: HTMLElement) {
        this.buttonElement = buttonElement
        this.Events.forEach(ev => {
            if (!ev.oldAddedEvent.includes(ev.eventName) && typeof this.component[ev.eventFire] == "function") {
                ev.oldAddedEvent.push(ev.eventName)
                buttonElement.addEventListener(ev.eventName, e => {
                    this.component[ev.eventFire](...ev.parameters)
                });
            }
        })
    }
}
export class dataGridEvent {
    oldAddedEvent: Array<string> = []
    constructor(eventName: string, eventFire: string, parameters: Array<any> = []) {
        this.eventName = eventName;
        this.eventFire = eventFire;
        this.parameters = parameters;
    }
    eventName: string = ""
    eventFire: string = "";
    parameters: Array<any> = [];
}