import {Injectable} from '@angular/core';
import {OrderModel} from '../../models';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(order: OrderModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, order);
  }

  getOrderById(orderId: string): Observable<OrderModel> {
    return this.http.get<OrderModel>(`${this.apiUrl}/by-id/${orderId}`);
  }
}
