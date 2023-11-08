import { Injectable } from '@angular/core';
import {MerchantModel} from "../models/merchant.model";
import {SignUpService} from "./sign-up.service";
import emailjs from '@emailjs/browser';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class ManageAccountService {
  private merchants: MerchantModel[] = [];

  constructor(private signUpService:SignUpService) {
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
    this.handleAccountRejected();
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
        this.handleCreatedAccSuccess();
      }, (err) => {
        this.handleCreatedAccFailed(err);
      });
  }

  private handleCreatedAccSuccess = (): void => {
    Swal.fire({
      icon: 'success',
      title: 'Account created!',
      text: 'Merchant account has been successfully created'
    });
  };

  private handleCreatedAccFailed = (message: string): void => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    });
  };

  private handleAccountRejected = (): void => {
    Swal.fire({
      icon: 'success',
      title: 'Account rejected!',
      text: 'Merchant account has been successfully rejected'
    });
  };
}