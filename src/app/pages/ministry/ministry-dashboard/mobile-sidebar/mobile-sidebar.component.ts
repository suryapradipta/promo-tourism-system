/**
 * This component represents the mobile sidebar of the application, providing navigation links
 * and functionality for user authentication and logout. It utilizes the AuthService for
 * checking user roles and handling the logout process, and the Router for navigation.
 */
import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mobile-sidebar',
  templateUrl: './mobile-sidebar.component.html',
  styleUrls: ['./mobile-sidebar.component.css'],
})
export class MobileSidebarComponent {
  activeLink: string = 'dashboard';

  /**
   * Set the active navigation link.
   *
   * @param {string} link - The link to set as active.
   */
  setActiveLink(link: string): void {
    this.activeLink = link;
  }

  /**
   * @constructor
   * @param {AuthService} authService - The service responsible for user authentication.
   * @param {Router} router - The Angular router service for navigation.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check if the currently authenticated user is of the 'ministry' role.
   *
   * @returns {boolean} - True if the user is a ministry, false otherwise.
   */
  isMinistry(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'ministry';
  }

  /**
   * Check if the currently authenticated user is of the 'merchant' role.
   *
   * @returns {boolean} - True if the user is a merchant, false otherwise.
   */
  isMerchant(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'merchant';
  }

  /**
   * Log out the currently authenticated user, displaying a confirmation dialog.
   * If confirmed, perform the logout action, show a success message, and navigate to the home page.
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
        this.authService.logOut();
        this.router.navigate(['/']);
      }
    });
  }
}
