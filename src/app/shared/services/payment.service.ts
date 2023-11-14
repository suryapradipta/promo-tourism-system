/**
 * This service manages payment-related operations, including saving payment data,
 * retrieving payment data, and fetching a payment by its unique identifier.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Injectable } from '@angular/core';
import { PaymentModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private payments: PaymentModel[] = [];

  /**
   * Initializes the service and loads payment data from local storage.
   *
   * @constructor
   */
  constructor() {
    this.loadPaymentsData();
  }

  /**
   * To load payment data from local storage.
   */
  private loadPaymentsData() {
    this.payments = JSON.parse(localStorage.getItem('payments')) || [];
  }

  /**
   * Save payment data by adding a payment to the payments array and updating
   * the data stored in local storage.
   *
   * @param {PaymentModel} payment - The payment data to be saved.
   */
  savePaymentsData(payment: PaymentModel) {
    this.payments.push(payment);
    localStorage.setItem('payments', JSON.stringify(this.payments));
    console.log('PAYMENT SERVICE', payment);
  }

  /**
   * Get all payment data stored in the service.
   *
   * @returns {PaymentModel[]} - Array of payment data.
   */
  getPaymentsData(): PaymentModel[] {
    this.loadPaymentsData();
    return this.payments;
  }

  /**
   * Get a payment by its unique identifier.
   *
   * @param {string} id - The unique identifier (paypalOrderId) of the payment.
   * @returns {PaymentModel | undefined} - The payment data if found, undefined otherwise.
   */
  getPaymentById(id: string): PaymentModel | undefined {
    return this.payments.find((payment) => payment.paypalOrderId === id);
  }
}
