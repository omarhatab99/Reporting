import { NgModule } from '@angular/core';
import {TableModule} from 'primeng-lts/table';
import {ToastModule} from 'primeng-lts/toast';
import {CalendarModule} from 'primeng-lts/calendar';
import {SliderModule} from 'primeng-lts/slider';
import {MultiSelectModule} from 'primeng-lts/multiselect';
import {ContextMenuModule} from 'primeng-lts/contextmenu';
import {DialogModule} from 'primeng-lts/dialog';
import {ButtonModule} from 'primeng-lts/button';
import {DropdownModule} from 'primeng-lts/dropdown';
import {ProgressBarModule} from 'primeng-lts/progressbar';
import {InputTextModule} from 'primeng-lts/inputtext';
import {DragDropModule} from 'primeng-lts/dragdrop';
import {TooltipModule} from 'primeng-lts/tooltip';
import { DynamicDialogModule} from 'primeng-lts/dynamicdialog';
import { TextEditorDialogComponent } from 'src/app/dialogs/text-editor-dialog/text-editor-dialog.component';
import {ChartModule} from 'primeng-lts/chart';
import {ConfirmDialogModule} from 'primeng-lts/confirmdialog';
import {ConfirmationService} from 'primeng-lts/api'
@NgModule({
  exports: [
    TableModule,
    ToastModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    ProgressBarModule,
    InputTextModule,
    CalendarModule,
    DynamicDialogModule,
    DragDropModule,
    TooltipModule,
    ChartModule,
    ConfirmDialogModule,
    
  ],
  entryComponents: [
    TextEditorDialogComponent
],
providers: [ConfirmationService]
})
export class PrimengModule { }
