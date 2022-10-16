import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent{

  @Input() activeMenu: string | undefined = 'home-menu';

  constructor() {
  }

  ngOnInit(): void {
    if (typeof this.activeMenu === "string") {
      const element = (document.getElementById(this.activeMenu) as HTMLElement);
      element.classList.add("active")
    }
  }
}
