import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  }

  showWarningMessage(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: message,
    });
  }

  showSuccessMessage(title: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  showEmailInUseMessage = (): void => {
    Swal.fire({
      icon: 'error',
      title: 'Email Already in Use',
      text: 'The email address you provided is already registered in our system. Please use a different email address.',
    });
  };
}
