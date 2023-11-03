
import {Injectable} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {MerchantModel} from "../models/merchant.model";

@Injectable({
  providedIn: 'root'
})

export class MerchantsService {
  private merchants: MerchantModel [] = [];

  constructor() {
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




}


