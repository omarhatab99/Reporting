import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IReport } from '../iterfaces/ireport';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  reportsData:BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private _HttpClient:HttpClient) { }

  GetAllReports():Observable<IReport[]>{
    return this._HttpClient.get<IReport[]>("https://freetestapi.com/api/v1/cars");
  }
}
