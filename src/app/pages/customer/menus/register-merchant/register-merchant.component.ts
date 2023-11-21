/**
 * This component handles the registration of merchant profiles, including form validation,
 * registration process, and file uploads. It interacts with the RegisterMerchantsService
 * for merchant-related functionality and the NotificationService to display messages.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  NotificationService,
  RegisterMerchantsService,
} from '../../../../shared/services';
import { MerchantModel } from '../../../../shared/models';

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css'],
})
export class RegisterMerchantComponent implements OnInit {
  // Flag to indicate if the form has been submitted
  public submitted = false;
  merchants: MerchantModel[] = [];

  /**
   * Constructor function for RegisterMerchantComponent.
   *
   * @constructor
   * @param {RegisterMerchantsService} merchantService - Service for managing merchant profiles.
   * @param {NotificationService} notificationService - Service for displaying notifications.
   */
  constructor(
    private merchantService: RegisterMerchantsService,
    private notificationService: NotificationService
  ) {}

  /**
   * Retrieves existing merchant data when the component is created.
   */
  ngOnInit(): void {
    this.merchants = this.merchantService.getMerchantsData();
  }

  /**
   * Handles the registration of a new merchant profile.
   * Validates the form, registers the merchant, and displays appropriate messages.
   *
   * @param {NgForm} form - The form containing merchant registration data.
   */
  onRegisterMerchant(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const isMerchantRegistered = this.merchantService.registerProfileMerchant(
      form.value.name,
      form.value.phone_number,
      form.value.email,
      form.value.company_description
    );

    if (isMerchantRegistered) {
      this.submitted = true;
      this.notificationService.showSuccessMessage('Register successful!');
    } else {
      this.notificationService.showEmailInUseMessage();
      return;
    }
  }

  // Variables for handling file uploads
  files: any;
  fileNames = [];

  /**
   * Handles the event when files are selected for upload.
   * Retrieves file information and stores file names.
   *
   * @param {any} event - The event containing information about the selected files.
   */
  onGetFile(event: any) {
    this.files = event.target.files;

    for (let i = 0; i < event.target.files.length; i++) {
      this.fileNames.push(event.target.files[i].name);
    }
  }

  /**
   * Handles the upload of files along with additional file descriptions.
   * Validates the form, uploads the files, and displays a success message.
   *
   * @param {NgForm} form - The form containing file upload data.
   */
  onUploadFile(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.merchantService.addDocumentsAndDescription(
      this.fileNames,
      form.value.file_description
    );
    this.fileNames = [];

    this.notificationService.showApplicationSuccessMessage();
  }
}
