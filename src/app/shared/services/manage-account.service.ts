/**
 * This service is responsible for managing merchant accounts, including loading merchant data,
 * retrieving merchants, handling pending applications, approving or rejecting merchants, and creating
 * merchant accounts with default passwords. It uses SignUpService for registration and
 * NotificationService for displaying account-related notifications.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Injectable } from '@angular/core';
import { MerchantModel } from '../models';
import { SignUpService } from './sign-up.service';
import emailjs from '@emailjs/browser';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ManageAccountService {
  private merchants: MerchantModel[] = [];

  /**
   * Constructor function for ManageAccountService.
   * Initializes the service and loads merchant data from local storage.
   *
   * @constructor
   * @param {SignUpService} signUpService - The service responsible for user registration.
   * @param {NotificationService} notificationService - The service responsible for displaying notifications.
   */
  constructor(
    private signUpService: SignUpService,
    private notificationService: NotificationService
  ) {
    this.loadMerchantsData();
  }

  /**
   * Private method to load merchant data from local storage.
   */
  private loadMerchantsData() {
    this.merchants = JSON.parse(localStorage.getItem('merchants')) || [];
  }

  /**
   * Get all merchant data.
   *
   * @returns {MerchantModel[]} - Array of all merchant data.
   */
  getMerchantsData(): MerchantModel[] {
    this.loadMerchantsData();
    return this.merchants;
  }

  /**
   * Get merchant by ID.
   *
   * @param {string} id - Merchant ID.
   * @returns {MerchantModel | undefined} - Merchant data or undefined if not found.
   */
  getMerchantById(id: string): MerchantModel | undefined {
    this.loadMerchantsData();
    return this.merchants.find((merchant) => merchant.id === id);
  }

  /**
   * Get all pending merchant applications.
   *
   * @returns {MerchantModel[]} - Array of merchants with 'PENDING' status.
   */
  getPendingApplications(): MerchantModel[] {
    this.loadMerchantsData();
    return this.merchants.filter((merchant) => merchant.status === 'PENDING');
  }

  /**
   * Approve a merchant application.
   *
   * @param {MerchantModel} merchant - Merchant to be approved.
   */
  approveMerchant(merchant: MerchantModel) {
    merchant.status = 'APPROVE';
    localStorage.setItem('merchants', JSON.stringify(this.merchants));
    this.createMerchantAccount(merchant);
  }

  /**
   * Reject a merchant application.
   *
   * @param {MerchantModel} merchant - Merchant to be rejected.
   */
  rejectMerchant(merchant: MerchantModel) {
    merchant.status = 'REJECT';
    localStorage.setItem('merchants', JSON.stringify(this.merchants));
    this.notificationService.showAccountRejectedMessage();
  }

  /**
   * Create a merchant account with a default password and send a confirmation email.
   *
   * @param {MerchantModel} merchant - Merchant for whom the account is being created.
   */
  createMerchantAccount(merchant: MerchantModel) {
    const email = merchant.email;
    const defaultPassword =
      'PRS*' + Math.round(Math.random()) + Math.round(Math.random());

    // Register merchant account
    this.signUpService.register(email, defaultPassword, 'merchant');

    // Prepare template parameters for the confirmation email
    const templateParams = {
      merchant_name: merchant.name,
      role: 'Merchant',
      contact_number: merchant.contact_number,
      default_password: defaultPassword,
      to_email: email,
      email_address: email,
    };

    // Send confirmation email using emailjs
    emailjs
      .send(
        'service_boieepv',
        'template_eucbozs',
        templateParams,
        'kLTeAvPa5TrTQmg_U'
      )
      .then(
        (response) => {
          this.notificationService.showAccountCreatedMessage();
        },
        (err) => {
          this.notificationService.showAccountFailedMessage(err);
        }
      );
  }
}
