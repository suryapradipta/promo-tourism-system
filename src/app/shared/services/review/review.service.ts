import { Injectable } from '@angular/core';
import { Order } from '../../models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient) {}

  getUnreviewedOrders(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.apiUrl}/unreviewed-orders/${customerId}`
    );
  }

  submitReview(
    orderId: string,
    rating: number,
    comment: string,
    userId: string
  ): Observable<any> {
    const reviewData = { orderId, rating, comment, userId };
    return this.http.post(`${this.apiUrl}//submit-review`, reviewData);
  }
}
