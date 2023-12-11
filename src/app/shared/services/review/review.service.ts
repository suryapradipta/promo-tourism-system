/**
 * This service manages the handling of customer reviews, including adding new reviews,
 * retrieving unreviewed orders for a customer, and loading/saving review data from/to local storage.
 */
import {Injectable} from '@angular/core';
import {OrderModel} from '../../models';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ReviewService {

  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) {
  }

  getUnreviewedOrders(customerId: string): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(`${this.apiUrl}/unreviewed-orders/${customerId}`);
  }

  submitReview(orderId: string, rating: number, comment: string, userId: string): Observable<any> {
    const reviewData = {orderId, rating, comment, userId};
    return this.http.post(`${this.apiUrl}//submit-review`, reviewData);
  }
}
