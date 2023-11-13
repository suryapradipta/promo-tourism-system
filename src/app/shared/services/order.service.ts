import {Injectable} from '@angular/core';
import {OrderModel, PaymentModel} from "../models";
import {v4 as uuidv4} from "uuid";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orders: OrderModel [] = [];

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

  getOrdersData() {
    this.loadOrdersData();
    return this.orders;
  }

  getOrderById(id: string): OrderModel | undefined {
    return this.orders.find((order) => order.orderID === id);
  }

  private orderCounter: number = 0;

  // generateOrderNumber(): string {
  //   const year = new Date().getFullYear();
  //   const paddedCounter = (++this.orderCounter).toString().padStart(5, '0');
  //   return `PRS${year}${paddedCounter}`;
  // }

  private static padWithZeros(number: number, length: number): string {
    return number.toString().padStart(length, '0');
  }
  generateOrderNumber(): string {
    const year = new Date().getFullYear();
    return `PRS${year}${
      OrderService.padWithZeros(++this.orderCounter, 5)
    }`;
  }




  createOrder(productId: string, quantity: number, email: string, phoneNumber: number): void {
    const order: OrderModel = {
      orderNumber: this.generateOrderNumber(),
      orderID: uuidv4(),
      productID: productId,
      quantity :quantity,
      email: email,
      phoneNumber: phoneNumber
    };

    this.saveOrdersData(order);

    console.log("ORDER SERVICE", this.getOrdersData())
    console.log("ORDER NUMBER", this.generateOrderNumber())
  }
}
