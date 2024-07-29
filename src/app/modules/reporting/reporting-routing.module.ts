import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './components/report/report.component';
import { TestComponent } from './components/test/test.component';


const routes: Routes = [
  {path:"" , component:ReportComponent},
  {path:"test" , component:TestComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
