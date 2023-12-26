/**
 * This component represents the desktop sidebar of the application,
 * providing navigation links and user-related functionalities.
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
   * @param {AuthService} authService - Service for managing user authentication.
   * @param {Router} router - Angular router service for navigation.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check if the current user has the role of 'ministry'.
   *
   * @returns {boolean} - True if the user is a ministry, false otherwise.
   */
  isMinistry(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'ministry';
  }

  /**
   * Check if the current user has the role of 'merchant'.
   *
   * @returns {boolean} - True if the user is a merchant, false otherwise.
   */
  isMerchant(): boolean {
    const user = this.authService.getCurrentUserJson();
    return user && user.role === 'merchant';
  }

  /**
   * Perform the logout operation.
   * Display a confirmation dialog before logging out.
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
