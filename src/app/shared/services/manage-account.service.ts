import { Injectable } from '@angular/core';
import {MerchantModel} from "../models/merchant.model";
import {SignUpService} from "./sign-up.service";
import emailjs from '@emailjs/browser';
import {NotificationService} from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class ManageAccountService {
  private merchants: MerchantModel[] = [];

  constructor(private signUpService:SignUpService, private notificationService:NotificationService) {
    this.loadMerchantsData();
  }

  private loadMerchantsData() {
    this.merchants = JSON.parse(localStorage.getItem('merchants')) || [];
  }

  getMerchantsData() {
    this.loadMerchantsData();
    return this.merchants;
  }

  getMerchantById(id: string) {
    this.loadMerchantsData();
    return this.merchants.find((merchant) => merchant.id === id);
  }

  getPendingApplications(): MerchantModel[] {
    this.loadMerchantsData();
    return this.merchants.filter((merchant) => merchant.status === 'PENDING');
  }

  approveMerchant(merchant: MerchantModel) {
    merchant.status = 'APPROVE';
    localStorage.setItem('merchants', JSON.stringify(this.merchants));
    this.createMerchantAccount(merchant);
  }

  rejectMerchant(merchant: MerchantModel) {
    merchant.status = 'REJECT';
    localStorage.setItem('merchants', JSON.stringify(this.merchants));
    this.notificationService.showAccountRejectedMessage();
  }

  createMerchantAccount(merchant: MerchantModel) {
    const email = merchant.email;
    const defaultPassword = 'PRS*' + Math.round(Math.random()) + Math.round(Math.random());

    this.signUpService.register(email, defaultPassword, 'merchant')

    const templateParams = {
      merchant_name: merchant.name,
      role: "Merchant",
      contact_number: merchant.contact_number,
      default_password: defaultPassword,
      to_email: email,
      email_address: email,
    };

    emailjs.send('service_boieepv',
      'template_eucbozs',
      templateParams, 'kLTeAvPa5TrTQmg_U')
      .then((response) => {
        this.notificationService.showAccountCreatedMessage();
      }, (err) => {
        this.notificationService.showAccountFailedMessage(err);
      });
  }
}
