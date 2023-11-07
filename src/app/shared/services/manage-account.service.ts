import { Injectable } from '@angular/core';
import {MerchantModel} from "../models/merchant.model";
import {SignUpService} from "./sign-up.service";

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
    console.log('[MANAGE MERC SERVICE]LOAD-MERCH-DATA', this.merchants);
  }

  getMerchantsData() {
    return this.merchants;
  }




  getMerchantById(id: string) {
    return this.merchants.find((merchant) => merchant.id === id);
  }

  getPendingApplications(): MerchantModel[] {
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
  }

  createMerchantAccount(merchant: MerchantModel) {
    const email = merchant.email;
    const defaultPassword = 'default';

    // You may need to send an email with the password or handle it differently

    this.signUpService.register(email, defaultPassword, 'merchant')


    // Display a success message to the ministry officer
    // alert(`Account created for ${email} with the password: ${defaultPassword}`);
  }
}
