import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng-lts/api';
import { TableComponent } from '../table/table.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-operation',
  templateUrl: './add-operation.component.html',
  styleUrls: ['./add-operation.component.css']
})
export class AddOperationComponent implements OnInit {

  //select elements from dom
  @ViewChild('operationElement') operationElement: ElementRef;
  @ViewChild('operationCollabse') operationCollabse: ElementRef;


  //random function id
  operationId: any;

  //operation varriables
  selectedOperationType:any = "onColumns";
  columnTitle:string;
  selectedOperationOptionOnTable: string = "sum";
  addTermToOperation: boolean = false;
  termWord: string = "";
  termWordPosition: string = "left";
  selectedColumn:any[] = [];
  constructor(private confirmationService: ConfirmationService, private tableComponent: TableComponent , private toasterService: ToastrService) { }
  
  ngOnInit(): void {

    
    console.log(this.columnTitle);
    console.log(this.selectedOperationType);
    console.log(this.selectedOperationOptionOnTable);
    console.log(this.addTermToOperation);
    console.log(this.termWord);
    console.log(this.termWordPosition);

    //defaults values
    this.operationId = this.getRandomId();

  }



 



  //delete function
  confirmationDeleteOperation(event: any) {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: 'هل تريد حذف الداله؟',
      accept: () => {
        const functionIndex = this.tableComponent.functionSelected.findIndex((func) => func.id == this.operationId);
        if(functionIndex != -1)
        {
          this.tableComponent.functionSelected.splice(functionIndex , 1);
        }

        this.operationElement.nativeElement.remove();
        this.operationCollabse.nativeElement.remove();
        this.toasterService.success('تم حذف العمليه بنجاح', 'نجح');

      }
    });
  }



  showOperationDialog(){
    //this.operationTableDialog = true;
  }


saveOperationTableDialog() {

}

closeOperationTableDialog(){

}

  getRandomId(): string {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return `filter-${random}`;
  }
}
