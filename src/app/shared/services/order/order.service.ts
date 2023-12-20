/**
 * This service interacts with the server's orders API to perform operations related to orders,
 * such as creating a new order and retrieving order details by ID.
 */
import { Injectable } from '@angular/core';
import { Order } from '../../models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  /**
   * @constructor
   * @param {HttpClient} http - Angular's HTTP client for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Create a new order by sending a POST request to the server.
   *
   * @param {Order} order - The order object containing order details.
   * @returns {Observable<any>} - Observable indicating the success or failure of the order creation.
   */
  createOrder(order: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, order);
  }

  /**
   * Get order details by ID by sending a GET request to the server.
   *
   * @param {string} orderId - The ID of the order for which details are requested.
   * @returns {Observable<Order>} - Observable containing the order details.
   */
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/by-id/${orderId}`);
  }
}
