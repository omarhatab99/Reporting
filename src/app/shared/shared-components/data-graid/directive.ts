import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[DataGridEditStyle]"
})
export class EditStyleDataGridDirective {
  constructor(private elm: ElementRef) {
  }
  ngAfterViewChecked(): void {
    let paginator = document.querySelectorAll("p-paginator");
    let thead = document.querySelectorAll("thead");
    if (thead != null) {
      // thead.forEach(th=>{
      //     th.style.position="relative"
      //     th.style.zIndex="500"
      // })

    }
    if (paginator != null) {
      paginator.forEach(_paginator => {
        if (_paginator.children.length > 0) {
          for (let i = 0; i < _paginator.children[0].children.length; i++) {
            let htmlElement = _paginator.children[0].children[i] as HTMLElement;
            if (htmlElement.tagName == "A") {
              htmlElement.style.transform = "rotateY(180deg)"
              htmlElement.style.marginRight = "5px"
              htmlElement.style.marginLeft = "5px"
            }
            htmlElement.style.fontSize = "16px"
          }
        }
      })

    }
  }
}

@Directive({
  selector: "[DataGridComboBoxStyle]"
})
export class DataGridComboBoxStyle {
  constructor(private elm: ElementRef) {
  }
  ngAfterViewChecked(): void {
    let comboBox = this.elm.nativeElement as HTMLElement;
    let selectElement2 = comboBox.children[0] as HTMLElement;
    selectElement2.style.width = "100%"
    comboBox.style.width = "100%"
    try {
      let selectElemnt3 = comboBox.children[0].children[3].children[1] as HTMLElement;
      selectElemnt3.style.direction = "ltr"
    } catch { }
    try {
      let selectElement4 = comboBox.children[0].children[3].children[0].children[0] as HTMLElement;
      selectElement4.style.paddingRight = "2.5em"
    } catch { }
    try {
      let selectElement5 = comboBox.children[0].children[1].children[0] as HTMLElement
      selectElement5.style.cssText = "text-wrap: balance;"
    } catch { }
    try {

      // let selectElement6 = comboBox.children[0].children[3].children[1].children[0].children[1].children[0].children[0] as HTMLElement;
      let selectElement6 = comboBox.children[0].children[3].children[1].children[0] as HTMLElement;
      for (let i = 0; i < selectElement6.children.length; i++) {
        let target = selectElement6.children.item(i).children[0].children[0] as HTMLElement;
        target.style.textAlign = "end"
        target.style.display = "block"
      }
    } catch { }

  }
}