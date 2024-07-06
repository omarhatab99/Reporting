import { Injectable, TemplateRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class LeftNav {
  private _state = new BehaviorSubject<TemplateRef<any>|null>(null);
  readonly contents = this._state.asObservable();

  setContents(ref: TemplateRef<any>): void {
    this._state.next(ref);
  }

  clearContents(): void {
    this._state.next(null);
  }
}