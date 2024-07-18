
export class Grid {
    Rows: any[] = [];
    SubGridData: Grid;
    Response: any[] = [];
    SubGridKey: string = '';
    CanHover: boolean = false;
    Columns: GridColumn[] = [];
    CanDelete: boolean = false;
    HasSubGrid: boolean = false;
    CanExportPDF: boolean = false;
    CanEditGlobal: boolean = false;
    CanExportExcel: boolean = false;
    CanInsertNewRow: boolean = false;
    CanResizeGlobal: boolean = false;
    CanFilterGlobal: boolean = false;
    RowsPerPageOptions: number[] = [];
    CanShowPagination: boolean = false;
    CanShowCrudOperations: boolean = false;

    constructor(SubGridKey: string = '', CanHover: boolean = false, Columns: GridColumn[], CanDelete: boolean = false, HasSubGrid: boolean = false,
        CanExportPDF: boolean = false, CanEditGlobal: boolean = false, CanExportExcel: boolean = false, CanInsertNewRow: boolean = false,
        CanResizeGlobal: boolean = false, CanFilterGlobal: boolean = false, RowsPerPageOptions: number[] = [], CanShowPagination: boolean = false,
        CanShowCrudOperations: boolean = false) {
        this.Columns = Columns;
        this.CanHover = CanHover;
        this.CanDelete = CanDelete;
        this.SubGridKey = SubGridKey;
        this.HasSubGrid = HasSubGrid;
        this.CanExportPDF = CanExportPDF;
        this.CanEditGlobal = CanEditGlobal;
        this.CanExportExcel = CanExportExcel;
        this.CanInsertNewRow = CanInsertNewRow;
        this.CanResizeGlobal = CanResizeGlobal;
        this.CanFilterGlobal = CanFilterGlobal;
        this.CanShowPagination = CanShowPagination;
        this.RowsPerPageOptions = RowsPerPageOptions;
        this.CanShowCrudOperations = CanShowCrudOperations;
    }
}

export class GridColumn {
    Width: Number = 11;
    Field: string = '';
    Header: string = '';
    Show: boolean = false;
    CanSort: boolean = false;
    CanEdit: boolean = false;
    CanFilter: boolean = false;
    CanResize: boolean = false;
    Type: ColumnType = ColumnType.Label;
    constructor(Width = 11, Field = '', Header = '', Show = false, CanSort = false, CanEdit = false, CanFilter = false, CanResize = false,
        Type: ColumnType = ColumnType.Label) {
        this.Type = Type;
        this.Show = Show;
        this.Width = Width;
        this.Field = Field;
        this.Header = Header;
        this.CanSort = CanSort;
        this.CanEdit = CanEdit;
        this.CanFilter = CanFilter;
        this.CanResize = CanResize;
    }
}

export enum ColumnType {
    Label = 1,
    Text = 2,
    Custom = 3
}