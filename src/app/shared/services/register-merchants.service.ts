/**
 * This service manages the registration and profile information of merchants. It allows
 * registering new merchant profiles, storing and retrieving merchant data, and updating
 * documents and descriptions for a merchant.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { MerchantModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegisterMerchantsService {
  private merchants: MerchantModel[] = [];

  /**
   * Constructor function for RegisterMerchantsService.
   * Initializes the service and loads merchant data from local storage.
   *
   * @constructor
   */
  constructor() {
    this.loadMerchantsData();
  }

  /**
   * Private method to load merchant data from local storage.
   */
  private loadMerchantsData() {
    this.merchants = JSON.parse(localStorage.getItem('merchants')) || [];
  }

  /**
   * Private method to save new merchant data to local storage.
   *
   * @param {MerchantModel} newMerchant - The new merchant data to be saved.
   */
  private saveMerchantsData(newMerchant: MerchantModel) {
    this.merchants.push(newMerchant);
    localStorage.setItem('merchants', JSON.stringify(this.merchants));
  }

  /**
   * Get the current merchant data.
   *
   * @returns {MerchantModel[]} - Array of merchant data.
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
   * @param {string} description - Description of the merchant.
   * @returns {boolean} - True if registration is successful, false if a merchant with the
   *                      same email already exists.
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
   * Add documents and description to the latest registered merchant.
   *
   * @param {any} documents - Documents to be associated with the merchant.
   * @param {string} document_description - Description of the documents.
   */
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
