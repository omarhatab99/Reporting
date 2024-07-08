import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

@Pipe({
  name: 'getObsData'
})
export class GetObsDataPipe implements PipeTransform {

  transform(value: Observable<any>): any {
    let data:any;
    value.subscribe((observer) => {return observer});
    
    return data;
  }

}
