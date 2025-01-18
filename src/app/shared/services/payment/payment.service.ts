/**
 * This service facilitates interactions with the server's payment API, providing
 * functionality to save payment information and retrieve payments by PayPal ID.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Payment } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  /**
   * @constructor
   * @param {HttpClient} http - Angular's HTTP client for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Save payment information by sending a POST request to the server.
   *
   * @param {Payment} payment - The payment information to be saved.
   * @returns {Observable<Payment>} - Observable containing the saved payment information.
   */
  savePayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/save-payment`, payment);
  }

  /**
   * Get payment information by PayPal ID.
   *
   * @param {string} paypalId - The PayPal ID associated with the payment.
   * @returns {Observable<Payment>} - Observable containing payment information for the given PayPal ID.
   */
  getPaymentByPaypalId(paypalId: string): Observable<Payment> {
    return this.http.get<Payment>(
      `${this.apiUrl}/get-by-paypal-id/${paypalId}`
    );
  }
}
