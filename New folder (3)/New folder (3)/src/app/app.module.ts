import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { NgxCaptureModule } from 'ngx-capture';
import { AppComponent } from './app.component';
import { esLocale } from 'ngx-bootstrap/locale';
import { TableModule } from 'primeng-lts/table';
import { ToastModule } from 'primeng-lts/toast';
import { ButtonModule } from 'primeng-lts/button';
import { DialogModule } from 'primeng-lts/dialog';
import { SidebarModule } from 'primeng-lts/sidebar';
import { TabViewModule } from 'primeng-lts/tabview';
import { ListboxModule } from 'primeng-lts/listbox';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { DropdownModule } from 'primeng-lts/dropdown';
import { CalendarModule } from 'primeng-lts/calendar';
import { GalleriaModule } from 'primeng-lts/galleria';
import { CheckboxModule } from 'primeng-lts/checkbox';
import { CarouselModule } from 'primeng-lts/carousel';
import { AppRoutingModule } from './app-routing.module';
import { InputTextModule } from 'primeng-lts/inputtext';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { JwPaginationModule } from 'jw-angular-pagination';
import { MultiSelectModule } from 'primeng-lts/multiselect';
import { ProgressBarModule } from 'primeng-lts/progressbar';
import { InputNumberModule } from 'primeng-lts/inputnumber';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { ProgressSpinnerModule } from 'primeng-lts/progressspinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadFileComponent } from './shared-components/upload-files/upload-files';
import { DateTimeComponent } from './shared-components/Date-Time/DateTime.component';
import { EditStyleDataGridDirective } from './shared-components/data-graid/directive';
import { ComboBoxComponent } from './shared-components/combo-box/combo-box.component';
import { TapeHeaderComponent } from './shared-components/TapeView/TapeHeader.component';
import { dataGraidComponent } from './shared-components/data-graid/data.graid.component';
import { EditStylePanelDirective } from './shared-components/TapeView/directaveEditStyle';
import { chartsComponent } from './shared-components/app.Chart.Component/chart.Component';
import { CheckBoxListComponent } from './shared-components/CheckBoxList/CheckBoxList.component';
import { ImagePreviewComponent } from './shared-components/ImagePreview/ImagePreview.component';
import { CheckBoxListDirective } from './shared-components/CheckBoxList/CheckBoxList.directive';

defineLocale('ar', esLocale);
const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

// Report viewer
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';

// data-visualization
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';






@NgModule({
  declarations: [
    AppComponent,
    chartsComponent,
    ComboBoxComponent,
    DateTimeComponent,
    dataGraidComponent,
    UploadFileComponent,
    TapeHeaderComponent,
    CheckBoxListDirective,
    CheckBoxListComponent,
    ImagePreviewComponent,
    EditStylePanelDirective,
    EditStyleDataGridDirective

  ],
  imports: [
    NgxCaptureModule,
    SidebarModule,
    InputNumberModule,
    ProgressSpinnerModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ProgressBarModule,
    FontAwesomeModule,
    JwPaginationModule,
    BrowserAnimationsModule,
    TableModule,
    ButtonModule,
    MultiSelectModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    CalendarModule,
    TabViewModule,
    ListboxModule,
    GalleriaModule,
    CheckboxModule,
    CarouselModule,
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgWizardModule.forRoot(ngWizardConfig),
    ReactiveFormsModule, AccordionModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ],

  providers: [
    ExcelService, DatePipe
  ],
  bootstrap: [AppComponent]

})
export class AppModule {

}
