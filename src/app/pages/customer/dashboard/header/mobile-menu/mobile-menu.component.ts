import { Component } from '@angular/core';
import { AuthService } from '../../../../../shared/services';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  isAuthenticated(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'customer';
  }
}
