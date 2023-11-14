/**
 * This service manages the creation, retrieval, and storage of orders. It includes
 * methods for generating unique order numbers, creating orders, and retrieving order data.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Injectable } from '@angular/core';
import { OrderModel } from '../models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: OrderModel[] = [];

  /**
   * Initializes the service and loads order data from local storage.
   *
   * @constructor
   */
  constructor() {
    this.loadOrdersData();
  }

  /**
   * To load order data from local storage.
   */
  private loadOrdersData() {
    this.orders = JSON.parse(localStorage.getItem('orders')) || [];
  }

  /**
   * Private method to save order data to local storage.
   *
   * @param {OrderModel} order - The order to be saved.
   */
  private saveOrdersData(order: OrderModel) {
    this.orders.push(order);
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

  /**
   * Get the array of all orders.
   *
   * @returns {OrderModel[]} - Array of order data.
   */
  getOrdersData(): OrderModel[] {
    this.loadOrdersData();
    return this.orders;
  }

  /**
   * Get an order by its unique identifier (orderID).
   *
   * @param {string} id - The unique identifier of the order.
   * @returns {OrderModel | undefined} - The order data if found, undefined otherwise.
   */
  getOrderById(id: string): OrderModel | undefined {
    return this.orders.find((order) => order.orderID === id);
  }

  // Counter for generating order numbers
  private orderCounter: number = 0;

  // generateOrderNumber(): string {
  //   const year = new Date().getFullYear();
  //   const paddedCounter = (++this.orderCounter).toString().padStart(5, '0');
  //   return `PRS${year}${paddedCounter}`;
  // }

  private static padWithZeros(number: number, length: number): string {
    return number.toString().padStart(length, '0');
  }

  /**
   * Generate a unique order number based on the current year and a counter.
   *
   * @returns {string} - The generated order number.
   */
  generateOrderNumber(): string {
    const year = new Date().getFullYear();
    return `PRS${year}${OrderService.padWithZeros(++this.orderCounter, 5)}`;
  }

  /**
   * Create a new order with the provided details and save it.
   *
   * @param {string} productId - The identifier of the product in the order.
   * @param {number} quantity - The quantity of the product in the order.
   * @param {string} email - The email address associated with the order.
   * @param {number} phoneNumber - The phone number associated with the order.
   */
  createOrder(
    productId: string,
    quantity: number,
    email: string,
    phoneNumber: number
  ): void {
    const order: OrderModel = {
      orderNumber: this.generateOrderNumber(),
      orderID: uuidv4(),
      productID: productId,
      quantity: quantity,
      email: email,
      phoneNumber: phoneNumber,
    };

    this.saveOrdersData(order);
  }
}
