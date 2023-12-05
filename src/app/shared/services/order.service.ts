import { Injectable } from '@angular/core';
import { OrderModel, ProductModel } from '../models';
import { v4 as uuidv4 } from 'uuid';
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








  private orders: OrderModel[] = [];









  getOrdersByCustomer(customerID: string): OrderModel[] {
    return this.orders.filter((order) => order.customerID === customerID);
  }

  getOrdersByMerchant(merchantID: string): OrderModel[] {
    return this.orders.filter((order) => order.merchantID === merchantID);
  }
}
