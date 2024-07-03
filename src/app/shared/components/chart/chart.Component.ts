import { Chart, ChartType, registerables } from 'chart.js'
import { chartsConfiguration } from "./chartsConfiguration";
import { AfterContentChecked, AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
    selector: 'app-chartComponent',
    templateUrl: './chart.Component.html',
    styleUrls: ['./chart.Component.css']
})
export class chartsComponent implements AfterContentChecked, AfterViewInit {
    @ViewChild('canvas', { static: false }) canvas: ElementRef;
    @ViewChild('container', { static: false }) container: ElementRef;
    @Input() height: number = 30;
    @Input() width: number = 70;
    @Input() typeSelect: ChartType = null;
    StringType: boolean = false;
   
    @ViewChild('containerBox', { static: false }) containerBox: ElementRef;
    @Input() chartsConfig: any = new chartsConfiguration();
    listChartDynamic: Array<chartsConfiguration> = [];
    ngAfterContentChecked(): void {
        if (typeof this.chartsConfig == "string") {
            this.listChartDynamic = [];
            this.StringType = true;
            let objectConvertArray = JSON.parse(this.chartsConfig) as Array<any>;
            let objectConvertArraySelected = [];
            if (this.typeSelect != null) {
                objectConvertArraySelected = objectConvertArray.filter(x => x.Type == this.typeSelect);
            }
            else {
                objectConvertArraySelected = objectConvertArray;
            }
            
            objectConvertArraySelected.forEach((chartDynamic) => {
                if (chartDynamic.Direction == '') chartDynamic.Direction = "vertical"
                let showHeader=false
                let dataSets = chartDynamic.Datasets as Array<any>;
                if(dataSets.length>1)
                {
                    showHeader=true;
                }
                let configDynamic: chartsConfiguration = new chartsConfiguration(showHeader, chartDynamic.Type, chartDynamic.Direction);
                configDynamic.ChartData.labels = chartDynamic.Labels.split(',')
                configDynamic.ChartData.datasets=[];
                dataSets.forEach(dataSit => {
                    configDynamic.ChartData.datasets.push({
                        data: dataSit.data,
                        label: dataSit.label,
                        backgroundColor:configDynamic.GetArrayRandomColor(configDynamic.ChartData.labels.length)
                    })
                })

                let setterProperly = configDynamic as any;
                setterProperly._ColumnWidth = chartDynamic.ColumnWidth as number
                setterProperly._Height = chartDynamic.ColumnHeight as number
                this.listChartDynamic.push(configDynamic)
            })
            this.chartsConfig = 0;
        }
    }

    ngAfterViewInit(): void {
        if (this.canvas != undefined) {
            this.chartsConfig = this.chartsConfig as chartsConfiguration;
            if (Chart.getChart(this.canvas.nativeElement) == undefined) {
                Chart.register(...registerables)
                let myChart = new Chart(this.canvas.nativeElement, {
                    type: this.chartsConfig.type,
                    data: this.chartsConfig.ChartData,
                    options: this.chartsConfig.ChartOptions,
                    plugins: this.chartsConfig.ChartPlugin,
                })
                this.chartsConfig.ChartCreated = myChart;
            }
            this.canvas.nativeElement.style.width = "100%"
            if (this.chartsConfig.type == "bar" || this.chartsConfig.type == "line") {

                let length = this.chartsConfig.ChartData.labels.length;
                if (length > 15) {
                    if (this.chartsConfig.direction == "vertical") {
                        const newWidth = 700 + (length * this.width);
                        this.containerBox.nativeElement.style.width = newWidth + 'px'
                    }
                }
            }
        }
    }


}
