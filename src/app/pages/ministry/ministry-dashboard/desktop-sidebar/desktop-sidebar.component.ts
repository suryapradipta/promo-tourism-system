import { Component } from '@angular/core';

@Component({
  selector: 'app-desktop-sidebar',
  templateUrl: './desktop-sidebar.component.html',
  styleUrls: ['./desktop-sidebar.component.css']
})
export class DesktopSidebarComponent {
  activeLink: string = 'dashboard';
  setActiveLink(link: string) {
    this.activeLink = link;
  }
}
