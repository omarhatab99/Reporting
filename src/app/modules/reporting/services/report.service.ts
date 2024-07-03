import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReport } from '../iterfaces/ireport';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private _HttpClient:HttpClient) { }

  GetAllReports():Observable<IReport[]>{
    return this._HttpClient.get<IReport[]>("../../assets/reporting.json");
  }
}
