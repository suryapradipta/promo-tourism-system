import { Component } from '@angular/core';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
})
export class MobileMenuComponent {
  // Array of navigation pages
  pages = [
    { name: 'Products', href: '/product-list#products' },
    { name: 'Company', href: '#' },
    { name: 'Services', href: '#' },
  ];
}
