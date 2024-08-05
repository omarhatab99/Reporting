import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportComponent } from './components/report/report.component';
import { MaterialModule } from '../material/material.module';
import { PrimengModule } from '../primeng/primeng.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularElementsResizerModule } from 'angular-elements-resizer';
import { TableComponent } from './components/table/table.component';
import { AddFilterComponent } from './components/add-filter/add-filter.component';
import { AddImageComponent } from './components/add-image/add-image.component';
import { ImageComponent } from './components/image/image.component';
import { AggregateComponent } from './components/aggregate/aggregate.component';
import { AddFunctionComponent } from './components/add-function/add-function.component';
import { NgxPrinterModule } from 'ngx-printer'
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ToastrModule } from 'ngx-toastr';
import { NgxPrintModule } from 'ngx-print';
import { NgxPrintElementModule } from 'ngx-print-element';
import { ContextMenuModule } from 'ngx-contextmenu';
import { ColorCircleModule } from 'ngx-color/circle';
import { ColorHueModule } from 'ngx-color/hue';
import { ColorAlphaModule } from 'ngx-color/alpha';
import { ColorCompactModule } from 'ngx-color/compact';
import { AddInputComponent } from './components/add-input/add-input.component';
import { addChartComponent } from './components/add-chart/add-chart.Component';
import { EditStylePanelDirective } from 'src/app/shared/shared-components/TapeView/directaveEditStyle';
import { TapeHeaderComponent } from 'src/app/shared/shared-components/TapeView/TapeHeader.component';
import { ImagePreviewComponent } from 'src/app/shared/shared-components/ImagePreview/ImagePreview.component';
import { DateTimeComponent } from 'src/app/shared/shared-components/Date-Time/DateTime.component';
import { ComboBoxComponent } from 'src/app/shared/shared-components/combo-box/combo-box.component';
import { dataGraidComponent } from 'src/app/shared/shared-components/data-graid/data.graid.component';
import { CheckBoxListComponent } from 'src/app/shared/shared-components/CheckBoxList/CheckBoxList.component';
import { CheckBoxListDirective } from 'src/app/shared/shared-components/CheckBoxList/CheckBoxList.directive';
import { TestComponent } from './components/test/test.component';
import { AddSignInputComponent } from './components/add-sign-input/add-sign-input.component';
import { AddOperationComponent } from './components/add-operation/add-operation.component';
import { OnlynumberDirective } from './directives/advanced-operation/only-number.directive';
import { AppHandleAdvancedKeydown } from './directives/advanced-operation/handle-advanced-keydown.directive';
import { HandleAdvancedKeyupDirective } from './directives/advanced-operation/handle-advanced-keyup.directive';
import { NgxColorsModule } from 'ngx-colors';
import { AdvancedOperationComponent } from './components/advanced-operation/advanced-operation.component';
@NgModule({
  declarations: [ReportComponent, addChartComponent,
    TextAreaComponent,
    TableComponent, AddFilterComponent,
    AddImageComponent, ImageComponent, AggregateComponent, AddFunctionComponent, AddInputComponent
    , CheckBoxListDirective, CheckBoxListComponent, dataGraidComponent, ComboBoxComponent, DateTimeComponent, ImagePreviewComponent, TapeHeaderComponent, EditStylePanelDirective, TestComponent
  , AddSignInputComponent, AddOperationComponent, OnlynumberDirective, AppHandleAdvancedKeydown, HandleAdvancedKeyupDirective, AdvancedOperationComponent],
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
    ColorCircleModule,
    ColorHueModule,
    ColorAlphaModule,
    ColorCompactModule,
    NgxColorsModule,
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
