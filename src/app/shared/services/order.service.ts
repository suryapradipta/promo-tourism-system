import { Injectable } from '@angular/core';
import {OrderModel} from "../models";
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

  createOrder(productId: string, quantity: number): void {
    const order: OrderModel = {
      orderID: uuidv4(),
      productID: productId,
      quantity :quantity,
    };

    this.saveOrdersData(order);
  }
}
