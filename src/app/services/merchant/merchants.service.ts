import {Injectable} from '@angular/core';
import {MerchantModel} from "../../models/merchant.model";
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MerchantsService {
  private merchants: MerchantModel [] = [];
  private lastID: any;

  getMerchants() {
    return this.merchants;
  }

  getLastID() {
    return this.lastID;
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

    // localStorage.setItem("merchant-data", JSON.stringify(merchant));

    this.lastID = this.merchants[this.merchants.length - 1];
    for (let data of this.getMerchants()) {
      console.log(data);
    }
  }

  getMerchantById(id: string) {
    return this.merchants.find(merchant => merchant.id === id);
  }

  addDocumentsAndDescription(documents: any, document_description: string) {
    // const merchant =  this.getMerchantById(this.lastID);
    this.lastID.documents = documents;
    this.lastID.document_description = document_description;
    for (let data of this.getMerchants()) {
      console.log("UPLOADED FILE", data);
    }


    for (let data of this.getMerchants()) {
      console.log("ALL",data);
    }

  }


  constructor() {
  }

}

