
import { AfterViewChecked, Directive, ElementRef } from "@angular/core";

@Directive({

    selector: "[EditStyle]"
})
export class EditStylePanelDirective implements AfterViewChecked{
    constructor(private elm: ElementRef) {

    }
    ngAfterViewChecked() {
        let element = this.elm.nativeElement as HTMLElement;
        try {
            // let bodyStyle = element.children[0] as HTMLElement;
            // bodyStyle.style.height = "100%"
            let bodyTabStyle = element.children[0].children[1] as HTMLElement;
            // bodyTabStyle.style.height = "100%"
            bodyTabStyle.style.border = "none"
            let HeaderStyle = element.children[0].children[0] as HTMLElement;
            HeaderStyle.style.display = "none"
        } catch { }
    }

}
