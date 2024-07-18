import { ComboBoxComponent } from "../combo-box/combo-box.component";

export interface property {
    name: string,
    isHide?: boolean,
    dateType: DateType,
}
export enum DateType {
    Text = 1,
    Date = 2,
    DataSource = 3
}
export class ConfigComboBox {
    appendTo: any = null;
    private _ItemSource = [];
    public set ItemSource(v: any[]) {
        this._ItemSource = v;
        if(this.component!=null)
        {
            this.component=this._component  
        }
    }
    public get ItemSource(): any[] {
        if(this.component!=null)
        {
            return this._component.ItemSource; 
        }
        return this._ItemSource
    }


    private _component: ComboBoxComponent = null;
    public set component(v: ComboBoxComponent) {
        this._component = v;
        this._component.ItemSource=this._ItemSource;
        if (this.required) {
            this.ClearActive = false;
            if (this.SelectedValue == null) this.SelectedValue = this._ItemSource[0]
            
        }
    }
    
    public get component() : ComboBoxComponent {
        return this._component
    }
    Properties: property[] = [];
    editable: boolean = false;
    showClear: boolean = false;
    ClearActive: boolean = true;
    required: boolean = false;
    ModelActive: boolean = false;
    logo: boolean = false;
    placeholder: string = "";
    pathLogoName: property = null;
    optionLabel: string = "";
    titleButtonSelectActiveMode: string = "";
    MessageAlertError: string = "";
    filter: boolean = true;
    filterBy: string = "";
    oldSelectedValue: any = null;
    public selectOldItem() {
        setTimeout(() => {
            this.SelectedValue = this.oldSelectedValue;
        }, 500);
    }
    private _SelectedValue: any = null;
    public set SelectedValue(v: any) {
        if (this.component != null) {
            if (this.component.dropdown != null) {
                this.component.reSelectItem(v, this.component.dropdown)
            }
        }
        this.oldSelectedValue = this._SelectedValue;
        this._SelectedValue = v;
    }

    public get SelectedValue(): any {
        return this._SelectedValue
    }

    IdConfig: number = -1;

    changeSelect(newValue: any, oldSelectedValue: any = null) {

    };
    ClearValue() {

    };
    constructor(placeholder: string, optionLabel: string, filterBy: string = null, stringProperty: string = null, itemSource: Array<any> = []) {
        if (filterBy == null) {
            filterBy = optionLabel;
        }
        if (stringProperty == null) {
            stringProperty = optionLabel;
        }
        if (optionLabel.includes(',')) {
            optionLabel = optionLabel.split(',')[1]
        }
        else {
            optionLabel = optionLabel
        }
        let ArrayFilterBy = [];
        if (filterBy.includes(',')) {
            ArrayFilterBy = filterBy.split(',')
        }
        else {
            ArrayFilterBy.push(filterBy)
        }
        this.filterBy = filterBy;
        this.placeholder = placeholder;
        this.optionLabel = optionLabel;
        this.ItemSource = itemSource;

        let ArrayOfProp = [];
        if (stringProperty.includes(',')) {
            ArrayOfProp = stringProperty.split(',')
        }
        else {
            ArrayOfProp.push(stringProperty)
        }
        ArrayOfProp.forEach((prop) => {
            this.Properties.push({
                dateType: DateType.Text,
                name: prop,
                isHide: false
            })
        })

    }
}