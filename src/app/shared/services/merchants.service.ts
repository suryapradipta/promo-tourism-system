
import {Injectable} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {MerchantModel} from "../models/merchant.model";
import {AuthService} from "./auth.service";
import {SignUpService} from "./sign-up.service";

@Injectable({
  providedIn: 'root'
})

export class MerchantsService {
  private merchants: MerchantModel [] = [];

  constructor(private signUpService:SignUpService) {
    this.merchants = JSON.parse(localStorage.getItem('merchants')) || [];
  }

  getMerchants() {
    return this.merchants;
  }

  addProfileMerchants(name: string, contact_number: number,
                      email: string,
                      description: string) {

    const uniqueID = uuidv4();

    const merchant: MerchantModel = {
      id: uniqueID,
      name: name,
      contact_number: contact_number,
      email: email,
      description: description,
      documents: null,
      document_description: null,
      status: "PENDING",
    };
    this.merchants.push(merchant);

    localStorage.setItem('merchants', JSON.stringify(this.merchants));
  }

  getMerchantById(id: string) {
    return this.merchants.find(merchant => merchant.id === id);
  }

  addDocumentsAndDescription(documents: any, document_description: string) {
    const lastID = this.merchants[this.merchants.length - 1];
    lastID.documents = documents;
    lastID.document_description = document_description;
    localStorage.setItem('merchants', JSON.stringify(this.merchants));

    for (let data of this.getMerchants()) {
      console.log("UPLOADED FILE", data);
    }
  }







  // Manage account services
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
    // Implement the logic for creating an account
    const email = merchant.email;
    const defaultPassword = 'default';

    // You may need to send an email with the password or handle it differently

    this.signUpService.register(email, defaultPassword, 'merchant')


    // Perform the account creation logic, e.g., save the email and password
    // to your authentication system, or create a user record
    // This example assumes a simple approach for demonstration purposes
    // this.signUpService.register(email, defaultPassword);


    // Display a success message to the ministry officer
    // alert(`Account created for ${email} with the password: ${defaultPassword}`);

  }


}


