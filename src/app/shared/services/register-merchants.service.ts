/**
 * This service manages the registration and data retrieval of merchant profiles. It allows
 * the registration of new merchant profiles, including the addition of documents and descriptions.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { MerchantModel } from '../models';
import { MERCHANTS } from '../mock/mock-merchants';

@Injectable({
  providedIn: 'root',
})
export class RegisterMerchantsService {
  private merchants: MerchantModel[] = [];

  /**
   * Initializes the service, loads existing merchant data from local storage, and initializes
   * the data with mock merchants if no data is present.
   *
   * @constructor
   */
  constructor() {
    this.loadMerchantsData();
    this.initializeData();
  }

  /**
   * Private method to initialize merchant data with mock data if no data is present.
   */
  private initializeData() {
    if (this.merchants.length === 0) {
      for (const item of MERCHANTS) {
        this.saveMerchantsData(item);
      }
    }
  }

  /**
   * Private method to load merchant data from local storage.
   */
  private loadMerchantsData() {
    this.merchants = JSON.parse(localStorage.getItem('merchants')) || [];
  }

  /**
   * Private method to save merchant data to local storage.
   *
   * @param {MerchantModel} newMerchant - The new merchant profile to be saved.
   */
  private saveMerchantsData(newMerchant: MerchantModel) {
    this.merchants.push(newMerchant);
    localStorage.setItem('merchants', JSON.stringify(this.merchants));
  }

  /**
   * Get the merchant data.
   *
   * @returns {MerchantModel[]} - Array of merchant profiles.
   */
  getMerchantsData(): MerchantModel[] {
    this.loadMerchantsData();
    return this.merchants;
  }

  /**
   * Register a new merchant profile.
   *
   * @param {string} name - Merchant's name.
   * @param {number} contact_number - Merchant's contact number.
   * @param {string} email - Merchant's email address.
   * @param {string} description - Merchant's description.
   * @returns {boolean} - True if registration is successful, false if a merchant with the
   *                      provided email already exists.
   */
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

  /**
   * Add documents and a description to the latest registered merchant.
   *
   * @param {any} documents - Merchant's documents.
   * @param {string} document_description - Description of the documents.
   */
  addDocumentsAndDescription(documents: any, document_description: string) {
    const lastID = this.merchants[this.merchants.length - 1];
    lastID.documents = documents;
    lastID.document_description = document_description;

    localStorage.setItem('merchants', JSON.stringify(this.merchants));
  }
}
