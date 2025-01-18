/**
 * This service interacts with the server's review API to retrieve unreviewed orders
 * for a customer and submit reviews for orders.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  /**
   * @constructor
   * @param {HttpClient} http - Angular's HTTP client for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Get unreviewed orders for a specific customer.
   *
   * @param {string} customerId - The ID of the customer for whom unreviewed orders are requested.
   * @returns {Observable<Order[]>} - Observable containing the unreviewed orders for the customer.
   */
  getUnreviewedOrders(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.apiUrl}/unreviewed-orders/${customerId}`
    );
  }

  /**
   * Submit a review for a specific order.
   *
   * @param {string} orderId - The ID of the order to be reviewed.
   * @param {number} rating - The rating given in the review.
   * @param {string} comment - The text comment provided in the review.
   * @param {string} userId - The ID of the user submitting the review.
   * @returns {Observable<any>} - Observable indicating the success or failure of the review submission.
   */
  submitReview(
    orderId: string,
    rating: number,
    comment: string,
    userId: string
  ): Observable<any> {
    const reviewData = { orderId, rating, comment, userId };
    return this.http.post(`${this.apiUrl}/submit-review`, reviewData);
  }
}
