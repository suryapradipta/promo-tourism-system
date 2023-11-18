/**
 * This service provides methods to display various types of notification messages
 * using the SweetAlert2 library.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

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
   * Display a success message notification with a title and a timer for auto-dismissal.
   *
   * @param {string} title - The title of the success message.
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
   * Display a success message for a successfully created account.
   */
  showAccountCreatedMessage = (): void => {
    Swal.fire({
      icon: 'success',
      title: 'Account created!',
      text: 'Merchant account has been successfully created',
    });
  };

  /**
   * Display an error message for a failed account creation.
   *
   * @param {string} message - The error message to be displayed.
   */
  showAccountFailedMessage = (message: string): void => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  };

  /**
   * Display a success message for a rejected account.
   */
  showAccountRejectedMessage = (): void => {
    Swal.fire({
      icon: 'success',
      title: 'Account rejected!',
      text: 'Merchant account has been successfully rejected',
    });
  };

  /**
   * Display an error message for an email that is already in use during account creation.
   */
  showEmailInUseMessage = (): void => {
    Swal.fire({
      icon: 'error',
      title: 'Email Already in Use',
      text: 'The email address you provided is already registered in our system. Please use a different email address.',
    });
  };

  /**
   * Display a success message for a successful application submission.
   */
  showApplicationSuccessMessage = (): void => {
    Swal.fire({
      icon: 'success',
      title: 'Register successful!',
      text: 'The form has been successfully submitted. Please wait for approval from the officer.',
      showConfirmButton: true,
    });
  };


}
