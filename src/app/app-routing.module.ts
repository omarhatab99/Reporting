import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './modules/reporting/components/report/report.component';


const routes: Routes = [
  {path: '', loadChildren: () => import('src/app/modules/reporting/reporting.module').then(m => m.ReportingModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
