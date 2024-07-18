import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './components/report/report.component';
import { ExcelReportComponent } from './components/excel-report/excel-report.component';


const routes: Routes = [
  {path:"" , component:ReportComponent},
  {path:"excel" , component:ExcelReportComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
