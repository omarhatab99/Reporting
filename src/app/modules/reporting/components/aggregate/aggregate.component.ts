import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { operationsFunction } from '../function/function.component';

@Component({
  selector: 'app-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: ['./aggregate.component.css']
})
export class AggregateComponent implements OnInit, OnChanges {
  value: any;
  @Input() reports: any[] = [];
  @Input() functions: any[] = [];
  columnFunctions: any[] = [];

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

  }

  ngOnInit(): void {
    console.log("onInit");

  }


}
