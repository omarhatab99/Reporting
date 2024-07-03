import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng-lts/api/menuitem';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
@Input()reports:any[]; 
@Input()cols:any[]; 
@Input() width:any;
@Input() cellPadding:any;
newReport: boolean;
displayDialog: boolean;
report:any = {};
selectedReport: any;
singleSelected:any;
items: MenuItem[];
@ViewChild("dataSourceTable") dataSourceTable:ElementRef;
  constructor() { }

  ngOnInit(): void {
    this.items = [
      { label: 'View', icon: 'pi pi-search', command: (event) => this.onRowSelect(event) },
      { label: 'Delete', icon: 'pi pi-times', command: (event) => this.delete() }
      
  ];

  console.log(this.selectedReport);
  }



  showDialogToAdd() {
    this.newReport = true;
    this.report = {};
    this.displayDialog = true;
  }

  save() {
    let reports = [...this.reports];
    if (this.newReport)
        reports.push(this.report);
    else
        reports[this.reports.indexOf(this.selectedReport)] = this.report;
  
    this.reports = reports;
    this.report = null;
    this.displayDialog = false;
  }
  
  delete() {
    let index = this.reports.indexOf(this.selectedReport);
    this.reports = this.reports.filter((val, i) => i != index);
    this.report = null;
    this.displayDialog = false;
  }
  
  onRowSelect(event) {
    console.log(event);
    this.newReport = false;
    this.report = this.cloneCar(event.data);
    this.displayDialog = true;
  }
  
  cloneCar(c: any): any {
    let report = {};
    for (let prop in c) {
        report[prop] = c[prop];
    }
    return report;
  }

    //delete text box element
    confirmationDeleteTextBox(event: any) {
      Swal.fire({
        title: "هل انت متاكد ؟",
        text: "لن تكون قادر على استعادته !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم امسح!",
        cancelButtonText: "تجاهل"
      }).then((result) => {
        if (result.isConfirmed) {
  
          this.dataSourceTable.nativeElement.remove();
  
          Swal.fire({
            position: "center",
            icon: "success",
            title: "تم حذف العنصر بنجاح",
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }


    
}
