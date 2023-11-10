import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { MerchantModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegisterMerchantsService {
  private merchants: MerchantModel[] = [];

  constructor() {
    this.loadMerchantsData();
  }

  private loadMerchantsData() {
    this.merchants = JSON.parse(localStorage.getItem('merchants')) || [];
  }

  private saveMerchantsData(newMerchant: MerchantModel) {
    this.merchants.push(newMerchant);
    localStorage.setItem('merchants', JSON.stringify(this.merchants));
  }

  getMerchantsData() {
    this.loadMerchantsData();
    return this.merchants;
  }

  registerProfileMerchant(
    name: string,
    contact_number: number,
    email: string,
    description: string
  ): boolean {
    const merchant: MerchantModel = {
      id: uuidv4(),
      name: name,
      contact_number: contact_number,
      email: email,
      description: description,
      documents: null,
      document_description: null,
      status: 'PENDING',
    };
    const existingMerchant = this.merchants.find(
      (exist) => exist.email === email
    );
    if (!existingMerchant) {
      this.saveMerchantsData(merchant);
      return true;
    }
    return false;
  }

  addDocumentsAndDescription(documents: any, document_description: string) {
    const lastID = this.merchants[this.merchants.length - 1];
    lastID.documents = documents;
    lastID.document_description = document_description;

    localStorage.setItem('merchants', JSON.stringify(this.merchants));

    this.getMerchantsData().forEach((data) => {
      console.log('[MERC-SERV] ADD DOCUMENTS', data);
    });
  }

}
