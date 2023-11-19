
import { Injectable } from '@angular/core';
import {AuthModel, OrderModel, ProductModel} from '../models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: OrderModel[] = [];

  constructor() {
    this.loadOrdersData();
  }

  private loadOrdersData() {
    this.orders = JSON.parse(localStorage.getItem('orders')) || [];
  }
  private saveOrdersData(order: OrderModel) {
    this.orders.push(order);
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }


  getOrdersData(): OrderModel[] {
    this.loadOrdersData();
    return this.orders;
  }


  getOrderById(id: string): OrderModel | undefined {
    return this.orders.find((order) => order.orderID === id);
  }

  // Counter for generating order numbers
  private orderCounter: number = 0;

  private static padWithZeros(number: number, length: number): string {
    return number.toString().padStart(length, '0');
  }

  generateOrderNumber(): string {
    const year = new Date().getFullYear();
    return `PRS${year}${OrderService.padWithZeros(++this.orderCounter, 5)}`;
  }

  createOrder(
    product: ProductModel,
    quantity: number,
    totalAmount: number,
    email: string,
    phoneNumber: number,
    customerID: string,
    merchantID: string,
  ): void {
    const order: OrderModel = {
      orderNumber: this.generateOrderNumber(),
      orderID: uuidv4(),
      product: product,
      quantity: quantity,
      totalAmount: totalAmount,
      email: email,
      phoneNumber: phoneNumber,
      customerID: customerID,
      merchantID: merchantID
    };

    this.saveOrdersData(order);
  }

  getOrdersByCustomer(customerID: string): OrderModel[] {
    return this.orders.filter(order => order.customerID === customerID);
  }

  getOrdersByMerchant(merchantID: string): OrderModel[] {
    return this.orders.filter((order) => order.merchantID === merchantID);
  }
}
