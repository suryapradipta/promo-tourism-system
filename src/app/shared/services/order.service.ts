/**
 * This service manages orders, providing functionality for creating orders, retrieving orders by various criteria,
 * and generating unique order numbers. It utilizes local storage to persist order data.
 */
import { Injectable } from '@angular/core';
import { OrderModel, ProductModel } from '../models';
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
   * Private method to load order data from local storage.
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
   * Get all orders stored in the service.
   *
   * @returns {OrderModel[]} - Array of all orders.
   */
  getOrdersData(): OrderModel[] {
    this.loadOrdersData();
    return this.orders;
  }

  /**
   * Get an order by its unique identifier.
   *
   * @param {string} id - The unique identifier of the order.
   * @returns {OrderModel | undefined} - The order with the specified identifier or undefined if not found.
   */
  getOrderById(id: string): OrderModel | undefined {
    return this.orders.find((order) => order.orderID === id);
  }

  // Counter for generating order numbers
  private orderCounter: number = 0;

  /**
   * Static method to pad a number with zeros to achieve a specified length.
   *
   * @param {number} number - The number to be padded.
   * @param {number} length - The desired length of the padded string.
   * @returns {string} - The padded string.
   */
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
   * Create a new order and save it to the service.
   *
   * @param {ProductModel} product - The product in the order.
   * @param {number} quantity - The quantity of the product in the order.
   * @param {number} totalAmount - The total amount of the order.
   * @param {string} email - The email of the customer placing the order.
   * @param {number} phoneNumber - The phone number of the customer.
   * @param {string} customerID - The unique identifier of the customer.
   * @param {string} merchantID - The unique identifier of the merchant.
   */
  createOrder(
    product: ProductModel,
    quantity: number,
    totalAmount: number,
    email: string,
    phoneNumber: number,
    customerID: string,
    merchantID: string
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
      merchantID: merchantID,
    };

    this.saveOrdersData(order);
  }

  /**
   * Get all orders placed by a specific customer.
   *
   * @param {string} customerID - The unique identifier of the customer.
   * @returns {OrderModel[]} - Array of orders placed by the specified customer.
   */
  getOrdersByCustomer(customerID: string): OrderModel[] {
    return this.orders.filter((order) => order.customerID === customerID);
  }

  /**
   * Get all orders associated with a specific merchant.
   *
   * @param {string} merchantID - The unique identifier of the merchant.
   * @returns {OrderModel[]} - Array of orders associated with the specified merchant.
   */
  getOrdersByMerchant(merchantID: string): OrderModel[] {
    return this.orders.filter((order) => order.merchantID === merchantID);
  }
}
