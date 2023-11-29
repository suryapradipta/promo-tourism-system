/**
 * This component represents the sidebar in the desktop view and provides functionality
 * for setting the active link, checking user roles, and handling logout with a confirmation dialog.
 */
import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-desktop-sidebar',
  templateUrl: './desktop-sidebar.component.html',
  styleUrls: ['./desktop-sidebar.component.css'],
})
export class DesktopSidebarComponent {
  // Variable to store the active link in the sidebar
  activeLink: string = 'dashboard';

  /**
   * Set the active link in the sidebar.
   *
   * @param {string} link - The link to set as active.
   */
  setActiveLink(link: string) {
    this.activeLink = link;
  }

  /**
   * Constructor function for DesktopSidebarComponent.
   *
   * @constructor
   * @param {AuthService} authService - The service responsible for user authentication.
   * @param {Router} router - The Angular router service for navigation.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check if the current user has the 'ministry' role.
   *
   * @returns {boolean} - True if the user has the 'ministry' role, false otherwise.
   */
  isMinistry(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'ministry';
  }

  /**
   * Check if the current user has the 'merchant' role.
   *
   * @returns {boolean} - True if the user has the 'merchant' role, false otherwise.
   */
  isMerchant(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'merchant';
  }

  /**
   * Log out the current user with a confirmation dialog.
   * If the user confirms, display a success message and navigate to the home page.
   */
  logout() {
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
