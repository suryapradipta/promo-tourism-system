import { Injectable } from '@angular/core';
import {MerchantModel, OrderModel, ReviewModel} from "../models";
import {v4 as uuidv4} from "uuid";
import {OrderService} from "./order.service";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviews: ReviewModel[] = [];

  constructor(private orderService : OrderService) {
    this.loadReviewsData();
  }

  private loadReviewsData() {
    this.reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  }

  private saveReviewsData(review: ReviewModel) {
    this.reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(this.reviews));
  }

  addReview(orderID: string, rating: number, comment: string): ReviewModel {
    const review: ReviewModel = {
      id: uuidv4(),
      orderID: orderID,
      rating: rating,
      comment: comment,
    };

    this.saveReviewsData(review);
    return review;
  }

  getUnreviewedOrders(customerID: string): OrderModel[] {
    const customerOrders = this.orderService.getOrdersByCustomer(customerID);

    // Filter out orders that already have reviews
    return customerOrders.filter(
      order => !this.reviews.some(review => review.orderID === order.orderID)
    );
  }
}
