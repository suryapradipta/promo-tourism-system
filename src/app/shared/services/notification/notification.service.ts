/**
 * This service provides methods for displaying various types of notifications using the
 * SweetAlert2 library. It offers functionality for showing error messages, warning messages,
 * success messages with auto-dismissal, and a specific message for indicating that an email
 * address is already in use during registration.
 */
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  /**
   * Display an error message notification.
   *
   * @param {string} message - The error message to be displayed.
   */
  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  }

  /**
   * Display a warning message notification.
   *
   * @param {string} message - The warning message to be displayed.
   */
  showWarningMessage(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: message,
    });
  }

  /**
   * Display a success message notification with auto-dismissal.
   *
   * @param {string} title - The title of the success message to be displayed.
   */
  showSuccessMessage(title: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  /**
   * Display a specific error message for an email address already in use during registration.
   */
  showEmailInUseMessage = (): void => {
    Swal.fire({
      icon: 'error',
      title: 'Email Already in Use',
      text: 'The email address you provided is already registered in our system. Please use a different email address.',
    });
  };
}
