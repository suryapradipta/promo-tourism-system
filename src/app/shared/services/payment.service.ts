import { Injectable } from '@angular/core';
import { PaymentModel } from '../models';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments';

  constructor(private http: HttpClient) {}

  savePayment(payment: PaymentModel): Observable<PaymentModel> {
    return this.http.post<PaymentModel>(`${this.apiUrl}/save-payment`, payment);
  }

  getPaymentByPaypalId(paypalId: string): Observable<PaymentModel> {
    return this.http.get<PaymentModel>(`${this.apiUrl}/get-by-paypal-id/${paypalId}`);
  }
}
