/**
 * This component represents the header section of the application, including navigation links,
 * user authentication status, and logout functionality. It interacts with AuthService for
 * authentication-related tasks and utilizes the Router for navigation.
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
  pages = [
    { name: 'Products', href: '/product-list#products' },
    { name: 'Company', href: '/' },
    { name: 'Services', href: '/' },
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
   * Check if a user is authenticated and has the role of 'customer'.
   *
   * @returns {boolean} - True if the user is authenticated and has the role of 'customer', false otherwise.
   */
  isAuthenticated(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'customer';
  }

  /**
   * Handle the logout process. Display a confirmation dialog using SweetAlert2,
   * and log the user out if confirmed. Navigate to the home page after successful logout.
   */
  onLogout(): void {
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
        this.authService.logOut();
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * Scroll to a specific section of the page with smooth behavior.
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
