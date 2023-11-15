/**
 * This Angular component represents the header section of the application,
 * including navigation links, user authentication status, and logout functionality.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  // Array of navigation pages
  pages = [
    { name: 'Products', href: '/product-list#products' },
    { name: 'Company', href: '#' },
    { name: 'Services', href: '#' },
  ];

  /**
   * Constructor function for HeaderComponent.
   *
   * @constructor
   * @param {AuthService} authService - The service responsible for user authentication.
   * @param {Router} router - The Angular router for navigation.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check if a user is logged in as a customer.
   *
   * @returns {boolean} - True if the user is logged in as a customer, false otherwise.
   */
  isLogged(): boolean {
    const user = this.authService.getCurrentUser();
    return user && user.role === 'customer';
  }

  /**
   * Log out the current user, displaying a confirmation dialog.
   * If the user confirms, log out and navigate to the home page.
   */
  logout(): void {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Log out!', 'You have been logged out.', 'success');
        this.authService.logout();
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * Scroll to a specific section on the page.
   *
   * @param {string} sectionId - The HTML element ID of the target section.
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
