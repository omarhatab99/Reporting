import { Chart, ChartData, ChartOptions, ChartType, Plugin } from "chart.js";

export class chartsConfiguration {
    constructor(showHeader:boolean=false,type:ChartType="bar",direction:'horizontal' | 'vertical' = 'vertical')
    {
        this.showHeader=showHeader;
        this.direction=direction;
        this.type=type;
    }
    private _direction: 'horizontal' | 'vertical' = 'vertical'
    public set direction(v : 'horizontal' | 'vertical') {
        this._direction = v;
    }
    public get direction() : 'horizontal' | 'vertical' {
        return this._direction
    }
    public showHeader:boolean=false
    private _type: ChartType = "bar";
    public set type(v: ChartType) {
        const alwaysShowTooltip = {
            id: "alwaysShowTooltip",
            afterDraw:(chart, args, options)=> {
                const ctx = chart.ctx as CanvasRenderingContext2D;
                ctx.save();
                chart.data.datasets.forEach((dataset, i) => {
                    chart.getDatasetMeta(i).data.forEach((dataPoint, index) => {

                        const textNumber = chart.data.datasets[i].data[index].toFixed(2)
                        
                        const textWidth = ctx.measureText(textNumber).width
                        let { x, y } = dataPoint.tooltipPosition();
                        if(this.showHeader && v=="bar")
                        {
                            if (this.direction == "horizontal") {
                                y = y + 12;
                                x = x + 12;
                                const textLabel = chart.data.datasets[i].label as string;
                                const textLabelWidth=ctx.measureText(textLabel).width
                                let xLabel=x+5;
                                ctx.fillStyle = "rgba(0,0,0,0.8)";
                                ctx.font = "11px Arial"                         
                                ctx.fillText(textLabel,xLabel+textLabelWidth+10, y - 9)
                            }
                            if (this.direction == "vertical") {
                                const textLabel = chart.data.datasets[i].label as string;
                                const textLabelWidth=ctx.measureText(textLabel).width
                                ctx.fillStyle = "rgba(0,0,0,0.8)";
                                ctx.font = "11px Arial"                         
                                ctx.fillText(textLabel, x - (textLabelWidth / 2) + 2, y - 40)
                            }
                        }
              
                        ctx.fillStyle = "rgba(0,0,0,0.8)";

                        ctx.fillRect(x - (textWidth / 2) - 3, y - 15, textWidth + 10, 12);

                        //triangle
                        ctx.fillStyle = "rgba(0,0,0,0.8)";
                        ctx.beginPath()
                        ctx.moveTo(x, y);
                        ctx.lineTo(x - 5, y - 5);
                        ctx.lineTo(x + 5, y - 5);
                        ctx.fill()
                        ctx.restore();


                        // text Area
                        ctx.font = "9px Arial"
                        ctx.fillStyle = "white";    
                        ctx.fillText(textNumber, x - (textWidth / 2) + 2, y - 9)
                        ctx.restore();
                        
                    })
                })
            }
        }
        this.ChartPlugin = [alwaysShowTooltip]
        if (v == "line" || v == "bar") {
            this.ChartOptions = {
                // maintainAspectRatio:false,
                scales: {
                    x: {
                        beginAtZero: true,
                    },
                },
            };
            if (this.direction == "horizontal") {
                this.ChartOptions.indexAxis = "y";
            }
        }
        else if (v == "pie" || v == "doughnut") {
            this.ChartOptions = {
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        enabled: true,
                    }
                },
            }
        }
        this._type = v;
    }
    public get type(): ChartType {
        return this._type
    }
    ChartData: ChartData = {
        labels: [],
        // labels: ['item ss swws ee 1 -1', 'itemwaaa weceds ssw 2 -2',"sssssssssssswedcsd sadasdasdasd -3",'item ss swws ee 1 -1', 'itemwaaa weceds ssw 2 -4',"sssssssssssswedcsd sadasdasdasd -5",'item ss swws ee 1 -6', 'itemwaaa weceds ssw 2 -2',"sssssssssssswedcsd sadasdasdasd -7"],
        datasets: [
            {
                label: "first",
                backgroundColor: this.GetArrayRandomColor(5),
                borderColor: this.GetArrayRandomColor(5),
                borderAlign: "center",
                data: []
            }
        ]
    };
  
    ChartOptions: ChartOptions = null
    ChartPlugin: Plugin[] = [];
    ChartCreated: Chart = null;
    resetData() {
        if (this.ChartCreated !== null && this.ChartCreated !== undefined) {
            this.ChartCreated.config.type = this.type;
            this.ChartCreated.config.options = this.ChartOptions;
            this.ChartCreated.config.data.datasets = this.ChartData.datasets;
            this.ChartCreated.config.data.labels = this.ChartData.labels;
            this.ChartCreated.update();
        }
    }
    public get RandomColor(): string {
        let randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52) as number;
        return `rgb(${randomNum()},${randomNum()},${randomNum()})`;
    }
    public GetArrayRandomColor(length: number): Array<string> {
        let result = [];
        for (let index = 0; index < length; index++) {
            result.push(this.RandomColor);
        }
        return result
    }
}