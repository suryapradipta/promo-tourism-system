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

  constructor(
    private signUpService: SignUpService,
    private alert: NotificationService
  ) {
    this.loadMerchantsData();
  }

  private loadMerchantsData() {
    this.merchants = JSON.parse(localStorage.getItem('merchants')) || [];
  }




  /*
    this.userService.register(email, defaultPassword, 'merchant', merchantId).subscribe(
    () => {
      this.alert.showSuccessMessage('Merchant account created successfully!');
    },
    (error) => {
      if (error.status === 400) {
        this.alert.showEmailInUseMessage();
      } else {
        this.alert.showErrorMessage('Merchant account creation failed. Please try again later.');
      }
    }
  );
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
          this.alert.showAccountCreatedMessage();
        },
        (err) => {
          this.alert.showAccountFailedMessage(err);
        }
      );
  }
}
