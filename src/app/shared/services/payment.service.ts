import { Injectable } from '@angular/core';
import {AuthModel, PaymentModel, ProductModel} from "../models";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private payments: PaymentModel[] = [];

  constructor() {
    this.loadPaymentsData();
  }

  private loadPaymentsData() {
    this.payments = JSON.parse(localStorage.getItem('payments')) || [];
  }

  savePaymentsData(payment: PaymentModel) {
    this.payments.push(payment);
    localStorage.setItem('payments', JSON.stringify(this.payments));
    console.log("PAYMENT SERVICE", payment)
  }

  getPaymentsData() {
    this.loadPaymentsData();
    return this.payments;
  }

  getPaymentById(id: string): PaymentModel | undefined {
    return this.payments.find((payment) => payment.paypalOrderId === id);
  }
}
