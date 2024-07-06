import { Directive, OnInit, TemplateRef } from "@angular/core";
import { LeftNav } from "./left-nav.service";

@Directive({
  selector: '[leftNav]',
})
export class LeftNavDirective implements OnInit {
  constructor(private leftNav: LeftNav, private ref: TemplateRef<any>) {}

  ngOnInit(): void {
    this.leftNav.setContents(this.ref);
  }
}