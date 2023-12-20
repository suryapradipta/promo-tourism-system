import { Injectable } from '@angular/core';
import { Payment } from '../../models';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments';

  constructor(private http: HttpClient) {}

  savePayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/save-payment`, payment);
  }

  getPaymentByPaypalId(paypalId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/get-by-paypal-id/${paypalId}`);
  }
}
