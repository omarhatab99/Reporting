
export class Line {
    Label: string = "";
    Value: string = "";
    visable: boolean = false;
}
export class TabeItem {
    LineView: Array<Line> = []
    item?: any = null;
    visable: boolean = false;
    StyleCalss: Array<string> = [];
    StyleBodyCalss: Array<string> = [];
    index: number = -1;
    nameSelectorBody: string = "";
    parent: TapeHeaderConfigration = null;
    GetStylesCalss(): string {

        let Calss = "";
        this.StyleCalss.forEach(item => {
            Calss += item;
        })
        return Calss
    }
    GetStyleHeaderCalss(): string {
        let Calss = "";
        this.StyleBodyCalss.forEach(item => {
            Calss += item;
        })
        return Calss
    }
    clickNative() {
        let nameSelect = "TapeHeaderItem-select "
        let nameSelectBody = "TapBody-select "
        this.parent.TapesHeader.forEach((tap => {
            let index = tap.StyleCalss.indexOf(nameSelect);
            let indexBody = tap.StyleBodyCalss.indexOf(nameSelectBody);
            tap.StyleCalss.splice(index, index);
            tap.StyleBodyCalss.splice(indexBody, indexBody);
        }))

        this.parent.SelectedTape = this;
        this.StyleCalss.push(nameSelect)
        this.StyleBodyCalss.push(nameSelectBody)
    }

}

export class TapeHeaderConfigration {
    ItemSource: Array<any> = [];
    TapesHeader: Array<TabeItem> = [];
    OnlyHeader: boolean = false
    SelectedTape: TabeItem = null;
    clickHeaderOn(item, index) {
        
    }
    GenreateTapeView(OnlyHeader: boolean = false, NameCustomSpecial: string = "", NewNameCustomSpecial: string = "", ItemSource: any[] = []) {
        this.OnlyHeader = OnlyHeader;
        this.TapesHeader = [];
        if (ItemSource.length > 0) {
            this.ItemSource = ItemSource;
        }
        let Array = NameCustomSpecial.split(",");
        let ArrayNew = NewNameCustomSpecial.split(",");
        let dx = 0;
        this.ItemSource.forEach(item => {
            let nTapeView = new TabeItem();
            nTapeView.index = dx;
            nTapeView.visable = true;
            nTapeView.item = item
            nTapeView.parent = this;
            if (NameCustomSpecial.length > 0) {
                let i = 0;
                Array.forEach((label) => {
                    let LineRow = new Line()
                    if (NewNameCustomSpecial.length > 0) {
                        LineRow.Label = ArrayNew[i]
                    }
                    else {
                        LineRow.Label = label
                    }
                    LineRow.Value = this.GetPropertyVlaue(label, item);
                    LineRow.visable = true;
                    nTapeView.LineView.push(LineRow);
                    i++;
                })
            }
            else {
                var PropertiesArray = Object.entries(item);
                PropertiesArray.forEach((prop: Array<any>) => {
                    let LineRow = new Line()
                    LineRow.Label = prop[0];
                    LineRow.Value = prop[1];
                    LineRow.visable = true;
                    nTapeView.LineView.push(LineRow);
                })
            }
            nTapeView.StyleCalss.push("TapeHeaderItem ")
            nTapeView.StyleBodyCalss.push("TapBody ")

            this.TapesHeader.push(nTapeView)
            dx++;
        })
    }

    onClick(itemSelect: TabeItem) {

    }

    private GetPropertyVlaue(PropertyName: string, property: any): string {
        let rValue: string = "";
        var PropertiesArray = Object.entries(property);
        PropertiesArray.forEach((prop: Array<any>) => {
            if (prop[0] == PropertyName) {
                rValue = prop[1]
            }
        })
        return rValue
    }
    constructor() {
        this.GenreateTapeView();
        if (this.TapesHeader.length > 0) {
            this.TapesHeader[0].clickNative();
        }
    }
}