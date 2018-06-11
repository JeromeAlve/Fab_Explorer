import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({
        opacity: '1'
      })),
      state('closed', style({
        opacity: '0',
        display: 'none',
      })),
      transition('closed => open', animate('400ms ease-in')),
      transition('open => closed', animate('100ms ease-out'))
    ])
  ]
})
export class NavBarComponent implements OnInit {
  isNavbarCollapsed = true;
  _isNavbarCollapsedAnim = 'closed';

  ngOnInit() {
    this.onResize(window);
  }

  @HostListener('window:resize', ['$event.target'])
  onResize(event) {
    if (event.innerWidth > 990) {
      // need to set this to 'open' for large screens to show up because of opacity in 'closed' animation.
      this._isNavbarCollapsedAnim = 'open';
      this.isNavbarCollapsed = true;
    } else {
      // comment this line if you don't want to collapse the navbar when window is resized.
      this._isNavbarCollapsedAnim = 'closed';
    }
  }

  toggleNavbar(): void {
    if (this.isNavbarCollapsed) {
      this._isNavbarCollapsedAnim = 'open';
      this.isNavbarCollapsed = false;
    } else {
      this._isNavbarCollapsedAnim = 'closed';
      this.isNavbarCollapsed = true;
    }
  }

  get isNavbarCollapsedAnim(): string {
    return this._isNavbarCollapsedAnim;
  }
}
