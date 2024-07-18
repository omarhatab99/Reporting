
import Swal from 'sweetalert2';
import * as fs from 'file-saver';
import * as buffer from 'buffer';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Helpper } from 'src/app/helpper/helpper';
import { environment } from 'src/environments/environment';
import { GeneralService } from 'src/app/Services/general.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { ColumnType, FilterColumnType, column, dataGridConfig } from '../data-graid/Config.data.graid';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.html',
  styleUrls: ['./upload-files.css']
})
export class UploadFileComponent extends Helpper {
  //#region Declrations
  felids: any[] = [];
  progress: number = 0;
  showLoading: boolean = false;
  @Input() reset: boolean = false;
  @Input() refresh: boolean = false;
  @Input() UrlPath: string = "Files";
  @Input() propertySource: any = null;
  @Input() isViewMode: Boolean = false;
  @Input() maxLengthFiles: number = 5120;
  @Input() InsertAutomatic: Boolean = true;
  @Input() propertySourceParent: any = null;
  @Input() propertyFelid: string = "name,size,path";
  propertyFelidPlaceholder: string = "name,size,path";
  grid: dataGridConfig<any> = new dataGridConfig(this);
  @Output() onUploadFinished = new EventEmitter<any>();
  @Input() multipleOrSingle: "multiple" | "single" = "multiple";
  @Input() typeFile: "pdf" | "doc" | "xls" | "xlsx" | "docx" | "image" | "all" = "pdf";
  // "pdf", "xls", "xlsx", "doc", "docx","jpg","jpeg","png","svg" 
  public get FileAccept(): string {
    if (this.typeFile == "image") {
      return "image/*"
    }
    else {
      return "application/" + this.typeFile
    }
  }
  //#endregion
  //#region Constructor
  constructor(public router: Router, public service: GeneralService, public datepipe: DatePipe, public toastr: ToastrService, private http: HttpClient) {
    super(toastr, router, service);
  }
  ngOnInit() {
    this.grid.ScrollHight = "400px";
    this.grid.CanFilterGlobal = false;
    this.felids = this.propertyFelid.split(',');
    let FelidsPlaceholder = ['اسم الملف', 'حجم الملف', 'مسار الملف'];
    this.grid.columns.push(new column("Seriale", "مسلسل", ColumnType.Label, null, 150, FilterColumnType.None))
    this.felids.forEach((Felid, index) => {
      if (index != 2) {
        this.grid.columns.push(new column(Felid, FelidsPlaceholder[index], ColumnType.Label, null, 150, FilterColumnType.None))
      }
    })
    this.grid.columns.forEach(c => {
      c.canSort = false;
      c.stopAllFilter = true;
    });
    this.grid.columns.push(new column("downloadFile", "تحميل الملف", ColumnType.Button, { class: "btn btn-primary m-1 px-3 w-100", style: "font-weight: bold; font-size: 16px;" }, 150, FilterColumnType.None))
    if (this.service?.newMopUserInfo?.PARAMETERS?.CRUD_OPERATION_TYPE != 'VIEW' && !this.isViewMode) {
      this.grid.columns.push(new column("deleteFile", "حذف الملف", ColumnType.Button, { class: "btn btn-danger m-1 px-3 w-100", style: "font-weight: bold; font-size: 16px;" }, 150, FilterColumnType.None))
    }
    this.grid.renderItemSource = (item, index) => {
      item.Seriale = index + 1;
    }
    this.updateSource();
  }
  ngOnChanges() {
    this.updateSource()
    if (this.reset) {
      this.grid.ItemSource = [];
      this.reset = false;
    }
  }
  //#endregion
  //#region Methods
  updateSource(): void {
    if (this.multipleOrSingle == "single") {
      if (this.propertySource[this.felids[0]] != "" && this.propertySource[this.felids[0]] != null) {
        let opj: any = {};
        opj[this.felids[0]] = this.propertySource[this.felids[0]]
        opj[this.felids[1]] = this.propertySource[this.felids[1]]
        // opj[this.felids[2]]= this.propertySource[this.felids[2]]
        this.grid.ItemSource = [opj];
      }
      else {
        this.grid.ItemSource = [];
      }
    }
    else {
      if (this.propertySourceParent[this.propertySource] != undefined && this.felids.length > 0) {
        this.propertySourceParent[this.propertySource] = this.propertySourceParent[this.propertySource]?.filter(obj => obj[this.felids[0]] != "" && obj[this.felids[0]] != null)
        this.grid.ItemSource = this.propertySourceParent[this.propertySource]
      }
    }
  }
  gridAction(event): void {
    switch (event.type) {
      case 'click':
        if (event.column.Name == "deleteFile") {
          Swal.fire({
            title: 'حذف الملف',
            text: "هل تريد حذف الملف ؟",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "نعم",
            cancelButtonText: "لا"
          })
            .then((result: any) => {
              if (result.value) {
                if (this.multipleOrSingle == "single") {
                  this.propertySource[this.felids[0]] = "";
                  this.propertySource[this.felids[1]] = 0;
                }
                else {
                  event.data[this.felids[0]] = "";
                  event.data[this.felids[1]] = 0;
                  this.propertySourceParent[this.propertySource] = this.propertySourceParent[this.propertySource].filter(obj => obj[this.felids[0]] != "" && obj[this.felids[0]] != null)
                  this.grid.ItemSource = this.propertySourceParent[this.propertySource]
                }
                this.updateSource()
              }
            })
        }
        else if (event.column.Name == "downloadFile") {
          fs.saveAs(environment.PathUrl + `Resources/${this.UrlPath}/` + this.getFileNameInServer(event.data), this.getFileNameInServer(event.data));
        }
        break;
    }
  }
  getFileNameInServer(item): string {
    let fileName = "";
    fileName = item[this.felids[0]];
    return fileName
  }
  createFilePath = (serverPath: string) => {
    return environment.PathUrl + `Resources/${this.UrlPath}/` + serverPath;
  }
  uploadAttachmentFiles(file: any): void {
    try {
      let files = file.files;
      this.showLoading = true;
      this.progress = 0;
      let fileToUpload = <File>files[0];
      const _url = environment.APIUrl + "LookUp/UploadFiles";
      if (files.length > 0) {
        if (fileToUpload.size > 0) {
          if (fileToUpload.size / 1024 <= 5120) {
            var extentionArray = fileToUpload.name.split('.');

            if (extentionArray[extentionArray.length - 1].toLowerCase() === this.typeFile || this.typeFile == "all" || this.typeFile == "image") {
              const reader: any = new FileReader();
              reader.readAsDataURL(fileToUpload);
              reader.onload = () => {
                let base64String = reader.result.toString();
                let SendFile = () => {
                  if (this.typeFile != "all") {
                    let byteChar = atob(base64String);
                    let byteArray = new Array(byteChar.length);
                    for (let i = 0; i < byteChar.length; i++) {
                      byteArray[i] = byteChar.charCodeAt(i);
                    }
                    let uIntArray = new Uint8Array(byteArray);
                    fileToUpload = new File([uIntArray], fileToUpload.name, { lastModified: fileToUpload.lastModified, type: this.FileAccept })
                  }
                  const formData = new FormData();
                  const FileName = extentionArray[0] + '_' + this.datepipe.transform(new Date(), 'yyyyMMddHHmmss') + '.' + extentionArray[extentionArray.length - 1];
                  formData.append('file', fileToUpload, FileName);
                  formData.append('pathSave', this.UrlPath);
                  const uploadReq = new HttpRequest('POST', _url, formData, {
                    reportProgress: true
                  });
                  this.http.request(uploadReq)
                    .subscribe((event: any) => {
                      if (event.type === HttpEventType.UploadProgress)
                        this.progress = Math.round(100 * event.loaded / event.total);
                      else if (event.type === HttpEventType.Response) {
                        if (event?.body?.success) {
                          this.toastr.success('إرفاق الملف بنجاح', 'تم');
                          if (this.multipleOrSingle == 'single') {
                            this.propertySource[this.felids[0]] = FileName;
                            this.propertySource[this.felids[1]] = Number.parseInt((fileToUpload.size / 1024).toString());
                            // this.propertySource[this.felids[2]] = this.createFilePath(FileName);
                          }
                          else {
                            if (this.propertySourceParent[this.propertySource] == undefined) {
                              this.propertySourceParent[this.propertySource] = [];
                            }
                            let nData: any = {};
                            nData[this.felids[0]] = FileName;
                            nData[this.felids[1]] = Number.parseInt((fileToUpload.size / 1024).toString());;
                            // nData[this.felids[2]] = this.createFilePath(FileName);
                            if (this.InsertAutomatic) {
                              this.propertySourceParent[this.propertySource].push(nData)
                            }
                            nData.ROW_NUMBER = this.propertySource.length * -1;
                          }
                          let EmitGo: any = {}
                          EmitGo[this.felids[0]] = FileName;
                          EmitGo[this.felids[1]] = Number.parseInt((fileToUpload.size / 1024).toString());;
                          EmitGo[this.felids[2]] = this.createFilePath(FileName);
                          this.onUploadFinished.emit(EmitGo);
                          setTimeout(() => {
                            this.updateSource();
                            this.showLoading = false;
                          }, 2000)
                        }
                        else {
                          this.progress = 0;
                          this.toastr.error(event?.body?.message, 'خطأ');
                        }
                      }


                    });
                }
                if (this.typeFile != 'all') {
                  if (this.typeFile == "image") {
                    base64String = base64String.replace(`data:image/${extentionArray[extentionArray.length - 1].toLowerCase()};base64,`, '');
                  }
                  else {
                    base64String = base64String.replace(`data:${this.FileAccept};base64,`, '');
                  }
                  const decoded: string = new buffer.Buffer(base64String, "base64").toString();
                  let getCondition = () => {
                    if (this.typeFile == "image") {
                      return extentionArray[extentionArray.length - 1].toUpperCase();
                    }
                    else {
                      return "%" + this.typeFile.toUpperCase()
                    }
                  }
                  if (!decoded.includes(getCondition())) {
                    this.progress = 0;
                    this.toastr.error('محتوى الملف الذى تم رفعة غير صحيح برجاء إعادة المحاولة', 'خطأ');
                    return;
                  }
                  else {
                    SendFile();
                  }
                }
                else {
                  SendFile();
                }
              }
            }
            else {
              this.toastr.error('الملف الذى تم رفعة يجب ان يكون ' + this.typeFile + ' برجاء إعادة المحاولة', 'خطأ');
              return;
            }
          }
          else {
            this.toastr.error('حجم الملف الذى تم رفعة يجب الا يتعدى 5 ميجا برجاء إعادة المحاولة', 'خطأ');

            return;
          }
        }
        else {
          this.toastr.error('محتوى الملف الذى تم رفعة فارغ برجاء إعادة المحاولة', 'خطأ');
          return;
        }
      }
      else {
        this.toastr.error('لم يتم إختيار ملف لرفعة برجاء إعادة المحاولة', 'خطأ');
        return;
      }
      file.value = null;
    }
    catch (error) { }
  }
  //#endregion
  //#region API Methods
  //#endregion
}
