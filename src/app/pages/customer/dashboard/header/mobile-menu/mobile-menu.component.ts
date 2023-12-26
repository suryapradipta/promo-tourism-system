/**
 * This component represents the mobile navigation menu. It includes an array of navigation
 * pages and a method to check if the current user is authenticated as a customer.
 */
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

  /**
   * @constructor
   * @param {AuthService} authService - The service responsible for user authentication.
   * @param {Router} router - The Angular router service for navigation.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check if the current user is authenticated as a customer.
   *
   * @returns {boolean} - True if the user is authenticated as a customer, false otherwise.
   */
  isAuthenticated(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'customer';
  }
}
