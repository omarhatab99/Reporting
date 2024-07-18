import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportComponent } from './components/report/report.component';
import { MaterialModule } from '../material/material.module';
import { PrimengModule } from '../primeng/primeng.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditableTextComponent } from 'src/app/shared/components/editable-text/editable-text.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextEditorDialogComponent } from 'src/app/dialogs/text-editor-dialog/text-editor-dialog.component';
import { AngularElementsResizerModule } from 'angular-elements-resizer';
import { TableComponent } from './components/table/table.component';
import { AddFilterComponent } from './components/add-filter/add-filter.component';
import { chartsComponent } from '../../shared/components/chart/chart.Component';
import { AddImageComponent } from './components/add-image/add-image.component';
import { ImageComponent } from './components/image/image.component';
import { AggregateComponent } from './components/aggregate/aggregate.component';
import { FunctionComponent } from './components/function/function.component';
import { GetObsDataPipe } from './pipes/get-obs-data.pipe';
import {NgxPrinterModule} from 'ngx-printer'
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ToastrModule } from 'ngx-toastr';
import {NgxPrintModule} from 'ngx-print';
import { NgxPrintElementModule } from 'ngx-print-element';
import {ContextMenuModule} from 'ngx-contextmenu';
import { ExcelReportComponent } from './components/excel-report/excel-report.component';
import { ColorBoxComponent } from './components/color-box/color-box.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [ReportComponent, 
    EditableTextComponent, TextAreaComponent,
     TextEditorDialogComponent, TableComponent, AddFilterComponent,
      chartsComponent, AddImageComponent, ImageComponent, AggregateComponent, FunctionComponent, GetObsDataPipe, ExcelReportComponent, ColorBoxComponent
    ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    HttpClientModule,
    AngularEditorModule,
    FormsModule,
    PrimengModule,
    MaterialModule,
    DragDropModule,
    ReactiveFormsModule,
    AngularElementsResizerModule,
    NgxPrintModule,
    NgxPrintElementModule,
    ColorPickerModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ContextMenuModule.forRoot(),
    NgxPrinterModule,
    
  ]
})
export class ReportingModule { }
