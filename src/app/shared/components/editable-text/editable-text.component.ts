import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.css']
})
export class EditableTextComponent implements OnInit {
  @Input("text") text:string;
  constructor() { }

  ngOnInit(): void {
  }

}
