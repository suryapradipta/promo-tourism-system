/**
 * This service handles the management of merchant accounts, including retrieval of merchant data,
 * approval or rejection of merchant applications, and the creation of merchant accounts.
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
   * Initializes the service and loads existing merchant data from local storage.
   *
   * @constructor
   * @param {SignUpService} signUpService - The service responsible for user registration.
   * @param {NotificationService} notificationService - The service for displaying notifications.
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
   * Get merchant data by ID.
   *
   * @param {string} id - The ID of the merchant.
   * @returns {MerchantModel | undefined} - Merchant data or undefined if not found.
   */
  getMerchantById(id: string): MerchantModel | undefined {
    this.loadMerchantsData();
    return this.merchants.find((merchant) => merchant.id === id);
  }

  /**
   * Get a list of pending merchant applications.
   *
   * @returns {MerchantModel[]} - Array of pending merchant applications.
   */
  getPendingApplications(): MerchantModel[] {
    this.loadMerchantsData();
    return this.merchants.filter((merchant) => merchant.status === 'PENDING');
  }

  /**
   * Approve a merchant application.
   *
   * @param {MerchantModel} merchant - The merchant to be approved.
   */
  approveMerchant(merchant: MerchantModel) {
    merchant.status = 'APPROVE';
    localStorage.setItem('merchants', JSON.stringify(this.merchants));
    this.createMerchantAccount(merchant);
  }

  /**
   * Reject a merchant application.
   *
   * @param {MerchantModel} merchant - The merchant to be rejected.
   */
  rejectMerchant(merchant: MerchantModel) {
    merchant.status = 'REJECT';
    localStorage.setItem('merchants', JSON.stringify(this.merchants));
    this.notificationService.showAccountRejectedMessage();
  }

  /**
   * Create a merchant account by registering the merchant and sending an account creation email.
   *
   * @param {MerchantModel} merchant - The merchant for whom the account is being created.
   */
  createMerchantAccount(merchant: MerchantModel) {
    const email = merchant.email;
    const defaultPassword =
      'PRS*' + Math.round(Math.random()) + '@' + Math.round(Math.random());

    this.signUpService.register(email, defaultPassword, 'merchant', merchant.id);

    const templateParams = {
      merchant_name: merchant.name,
      role: 'Merchant',
      contact_number: merchant.contact_number,
      default_password: defaultPassword,
      to_email: email,
      email_address: email,
    };

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
