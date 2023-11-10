import { Injectable } from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }


  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  }

  showSuccessMessage(title:string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1500
    });
  }


   showAccountCreatedMessage = (): void => {
    Swal.fire({
      icon: 'success',
      title: 'Account created!',
      text: 'Merchant account has been successfully created'
    });
  };

   showAccountFailedMessage = (message: string): void => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    });
  };

   showAccountRejectedMessage = (): void => {
    Swal.fire({
      icon: 'success',
      title: 'Account rejected!',
      text: 'Merchant account has been successfully rejected'
    });
  };

  showEmailInUseMessage = (): void => {
    Swal.fire({
      icon: 'error',
      title: 'Email Already in Use',
      text: 'The email address you provided is already registered in our system. Please use a different email address.',
    });
  };

  showApplicationSuccessMessage = (): void => {
    Swal.fire({
      icon: 'success',
      title: 'Register successful!',
      text:'The form has been successfully submitted. Please wait for approval from the officer.',
      showConfirmButton: true,
    });
  };
}
