import { AfterViewChecked, Directive, ElementRef, Input } from '@angular/core';

@Directive({
	selector: '[CheckBoxListStyle]'
})
export class CheckBoxListDirective implements AfterViewChecked {
	@Input() CheckBoxListStyle:number=500;
	constructor(private el: ElementRef) {

	}
	ngAfterViewChecked() {
		let checkboxListElement = this.el.nativeElement as HTMLElement;
		if (checkboxListElement != null) {
			try {
				let tartgetElment = checkboxListElement.children[0] as HTMLElement
				tartgetElment.style.width = "100%";
			} catch { }
			try {
				let tartgetElment = checkboxListElement.children[0].children[0] as HTMLElement
				tartgetElment.style.width = "100%";
			} catch { }
			try {
				let tartgetElment = checkboxListElement.children[0].children[2].children[0] as HTMLElement
				tartgetElment.style.marginLeft = "4px";
			} catch { }
			try {
				let tartgetElment = checkboxListElement.children[0].children[3].children[0] as HTMLElement
				for (let i = 0; i < tartgetElment.children.length; i++) {
					let ElementG = tartgetElment.children[i] as HTMLElement
					try {
						let Element = ElementG.children[0] as HTMLElement;
						Element.style.marginLeft = "6px";
					} catch { }
				}

			} catch { }
		}
	}

}
