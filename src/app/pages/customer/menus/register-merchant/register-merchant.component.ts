/**
 * This Angular component handles the registration of merchants, including form submission,
 * error handling, and file uploads. It utilizes the MerchantService for communication
 * with the backend, LoadingService for managing loading indicators, and NotificationService
 * for displaying alert messages.
 */
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  LoadingService,
  MerchantService,
  NotificationService,
} from '../../../../shared/services';

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css'],
})
export class RegisterMerchantComponent {
  public submitted = false;
  private merchantId: string;
  files: any;

  /**
   * @constructor
   * @param {MerchantService} merchantService - Service for interacting with merchant-related functionality.
   * @param {NotificationService} alert - Service for displaying notification messages.
   * @param {LoadingService} loading - Service for managing loading indicators.
   */
  constructor(
    private merchantService: MerchantService,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

  /**
   * Handles the submission of the merchant registration form.
   * If the form is valid, it calls the MerchantService to register the merchant.
   * Displays success or error messages accordingly.
   *
   * @param {NgForm} form - The NgForm instance representing the registration form.
   */
  onRegisterMerchant(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.loading.show();
    this.merchantService
      .registerMerchant(
        form.value.name,
        form.value.contact_number,
        form.value.email,
        form.value.company_description
      )
      .subscribe(
        (response) => {
          this.loading.hide();
          this.submitted = true;
          this.alert.showSuccessMessage(response.message);
          this.merchantId = response.id;
        },
        (error) => {
          this.loading.hide();
          console.error('Error registering merchant:', error);
          if (error.status === 500 || error.status === 409) {
            this.alert.showEmailInUseMessage();
          } else {
            this.alert.showErrorMessage(
              error.error?.message || 'Registration failed. Please try again.'
            );
          }
        }
      );
  }

  /**
   * Handles the selection of files for upload.
   *
   * @param {any} event - The file selection event.
   */
  onGetFile(event: any): void {
    this.files = event.target.files;
  }

  /**
   * Handles the submission of the file upload form.
   * If the form is valid, it calls the MerchantService to upload documents.
   * Displays success or error messages accordingly.
   *
   * @param {NgForm} form - The NgForm instance representing the file upload form.
   */
  onUploadFile(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.loading.show();
    this.merchantService
      .uploadDocuments(this.merchantId, this.files, form.value.file_description)
      .subscribe(
        (response) => {
          this.loading.hide();
          this.submitted = true;
          this.alert.showSuccessMessageWithText(
            'Register successful!',
            'The form has been successfully submitted. Please wait for approval from the officer.'
          );
        },
        (error) => {
          this.loading.hide();
          console.error('Error uploading documents:', error);
          this.alert.showErrorMessage(
            error.error?.message || 'Error uploading documents.'
          );
        }
      );
  }
}
