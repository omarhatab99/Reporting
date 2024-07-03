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
import { AddTextAreaComponent } from './components/add-text-area/add-text-area.component';
import { TextEditorDialogComponent } from 'src/app/dialogs/text-editor-dialog/text-editor-dialog.component';
import { AngularElementsResizerModule } from 'angular-elements-resizer';
import { TableComponent } from './components/table/table.component';
import { AddFilterComponent } from './components/add-filter/add-filter.component';
import { chartsComponent } from '../../shared/components/chart/chart.Component';

@NgModule({
  declarations: [ReportComponent, EditableTextComponent, TextAreaComponent, AddTextAreaComponent, TextEditorDialogComponent, TableComponent, AddFilterComponent, chartsComponent],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    HttpClientModule,
    FormsModule,
    PrimengModule,
    MaterialModule,
    DragDropModule,
    ReactiveFormsModule,
    AngularElementsResizerModule,

  ]
})
export class ReportingModule { }
