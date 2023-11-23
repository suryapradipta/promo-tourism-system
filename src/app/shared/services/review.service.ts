/**
 * This service manages the handling of customer reviews, including adding new reviews,
 * retrieving unreviewed orders for a customer, and loading/saving review data from/to local storage.
 */
import { Injectable } from '@angular/core';
import { OrderModel, ReviewModel } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviews: ReviewModel[] = [];

  /**
   * Initializes the service and loads review data from local storage.
   *
   * @constructor
   * @param {OrderService} orderService - The service responsible for managing orders.
   */
  constructor(private orderService: OrderService) {
    this.loadReviewsData();
  }

  /**
   * Private method to load review data from local storage.
   */
  private loadReviewsData() {
    this.reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  }

  /**
   * Save a new review to the array and update local storage.
   *
   * @param {ReviewModel} review - The review to be saved.
   */
  private saveReviewsData(review: ReviewModel) {
    this.reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(this.reviews));
  }

  /**
   * Add a new review for a specific order, including a rating and comment.
   *
   * @param {string} orderID - The ID of the order being reviewed.
   * @param {number} rating - The rating given in the review.
   * @param {string} comment - Optional comment provided by the reviewer.
   * @returns {ReviewModel} - The newly created review.
   */
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

  /**
   * Get a list of unreviewed orders for a specific customer by filtering out orders
   * that already have associated reviews.
   *
   * @param {string} customerID - The ID of the customer for whom to retrieve unreviewed orders.
   * @returns {OrderModel[]} - Array of unreviewed orders for the specified customer.
   */
  getUnreviewedOrders(customerID: string): OrderModel[] {
    const customerOrders = this.orderService.getOrdersByCustomer(customerID);

    // Filter out orders that already have reviews
    return customerOrders.filter(
      (order) =>
        !this.reviews.some((review) => review.orderID === order.orderID)
    );
  }
}
