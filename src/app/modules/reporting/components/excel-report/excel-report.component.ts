import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/excel-service.service';

@Component({
  selector: 'app-excel-report',
  templateUrl: './excel-report.component.html',
  styleUrls: ['./excel-report.component.css']
})
export class ExcelReportComponent implements OnInit {

  data: any[] = [];
  columns: any[];
  footerData: any[][] = [];
  totalSalesAmount = 0;
  // users:any[] = [];
  constructor(public excelService: ExcelService) { }

  ngOnInit(): void {

    this.columns = ['Invoice ID', 'Invoice Date', 'Device Name', 'Amount'];
    this.data = [
      {
        InvoiceID : 'INV0001',
        DeviceName: 'Redmi Note 6 Pro',
        Date: '25-06-2020',
        Amount: 16000,
      }, {
        InvoiceID : 'INV0002',
        DeviceName: 'iPhone XR',
        Date: '25-06-2020',
        Amount: 19000,
      },
      {
        InvoiceID : 'INV0003',
        DeviceName: 'iPaid Mini 5',
        Date: '26-06-2020',
        Amount: 35000,
      },
      {
        InvoiceID : 'INV0004',
        DeviceName: 'Samsung S10',
        Date: '26-06-2020',
        Amount: 35000,
      }
    ];

    this.totalSalesAmount = this.data.reduce((sum, item) => sum + item.Amount, 0);
    this.footerData.push(['Total', '', '', this.totalSalesAmount]);

  }

  exportExcel() {
    this.excelService.exportAsExcelFile('Sales Report', 'anything', this.columns, this.data, this.footerData, 'sales-report', 'Sheet1');
  }

  // csvImport(event:any) {
  //   const files = event.target.files;
  //   if(files.length){
  //     const file = files[0];

  //     const reader = new FileReader();
  //     reader.onload = (event:any) => {
  //       const wb = read(event.target.result);
  //       const sheets = wb.SheetNames;

  //       if(sheets.length){

  //         const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
  //         this.users = rows;
  //       }
  //     }

  //     reader.readAsArrayBuffer(file);
  //   }

    
  // }

  // csvExport(){
  //   const headings = [['id' , 'name' , 'emal' , 'age' , 'address']];
  //   const wb = utils.book_new();
  //   const ws:any = utils.json_to_sheet([]);
  //   utils.sheet_add_aoa(ws , headings);
  //   utils.sheet_add_json(ws , this.users , {
  //     origin:"A2",
  //     skipHeader: true
  //   });
  //   utils.book_append_sheet(wb , ws , "users");
  //   writeFile(wb , "user-report.xlsx");
  // }

}
