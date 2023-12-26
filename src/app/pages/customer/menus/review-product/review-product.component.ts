/**
 * This component manages the review process for products. It displays a list of unreviewed
 * orders for the currently authenticated user and provides a form to submit reviews.
 */
import { Component, OnInit } from '@angular/core';
import { Auth, Order } from '../../../../shared/models';
import {
  AuthService,
  LoadingService,
  NotificationService,
  ReviewService,
} from '../../../../shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-product',
  templateUrl: './review-product.component.html',
  styleUrls: ['./review-product.component.css'],
})
export class ReviewProductComponent implements OnInit {
  unreviewedOrders: Order[] = [];
  showReviewForm = false;
  reviewForm: FormGroup;
  selectedOrderId: string;

  /**
   * @constructor
   * @param {FormBuilder} formBuilder - Angular service for building reactive forms.
   * @param {NotificationService} alert - Service for displaying notifications.
   * @param {ReviewService} reviewService - Service for managing product reviews.
   * @param {AuthService} authService - Service for managing user authentication.
   * @param {LoadingService} loading - Service for displaying loading indicators.
   */
  constructor(
    private formBuilder: FormBuilder,
    private alert: NotificationService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private loading: LoadingService
  ) {}

  /**
   * Loads unreviewed orders and initializes the review form.
   */
  ngOnInit(): void {
    this.loadUnreviewedOrders();
    this.initReviewForm();
  }

  /**
   * Getter for accessing form controls in the template.
   */
  get formControl() {
    return this.reviewForm.controls;
  }

  /**
   * Private method to load unreviewed orders for the current user.
   */
  private loadUnreviewedOrders(): void {
    const user: Auth = this.authService.getCurrentUserJson();

    if (user) {
      this.loading.show();
      this.reviewService.getUnreviewedOrders(user._id).subscribe(
        (response: Order[]) => {
          this.loading.hide();
          this.unreviewedOrders = response;
        },
        (error) => {
          this.loading.hide();
          console.error('Error retrieving unreviewed orders:', error);
          if (error.status === 404) {
            this.alert.showErrorMessage('No unreviewed orders found.');
          } else {
            const errorMessage =
              error.error?.message || 'Failed to retrieve unreviewed orders.';
            this.alert.showErrorMessage(errorMessage);
          }
        }
      );
    }
  }

  /**
   * Format the order date for display in the template.
   *
   * @param {string} date - Order date string.
   * @returns {string} - Formatted date string.
   */
  formatOrderDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Private method to initialize the review form with validators.
   */
  private initReviewForm(): void {
    this.reviewForm = this.formBuilder.group({
      rating: [
        null,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      comment: [null, Validators.required],
    });
  }

  /**
   * Open the review form for a selected order.
   *
   * @param {string} orderId - ID of the selected order for review.
   */
  openReviewForm(orderId: string): void {
    this.showReviewForm = true;
    this.selectedOrderId = orderId;
  }

  /**
   * Close the review form.
   */
  closeReviewForm(): void {
    this.showReviewForm = false;
    this.selectedOrderId = null;
  }

  /**
   * Submit the review form. If the form is valid, send the review to the server.
   */
  submitReview(): void {
    if (this.reviewForm.valid) {
      const orderId: string = this.selectedOrderId;
      const userId = this.authService.getCurrentUserJson()._id;

      const rating = this.reviewForm.value.rating;
      const comment = this.reviewForm.value.comment;

      this.loading.show();
      this.reviewService
        .submitReview(orderId, +rating, comment, userId)
        .subscribe(
          (response) => {
            this.loading.hide();
            this.reviewForm.reset();
            this.showReviewForm = false;
            this.loadUnreviewedOrders();
            this.alert.showSuccessMessage(response.message);
          },
          (error) => {
            this.loading.hide();
            console.error('Error submitting review:', error);

            if (error.status === 400) {
              this.alert.showErrorMessage('All fields are required');
            } else if (error.status === 404) {
              this.alert.showErrorMessage('Order or product not found');
            } else {
              const errorMessage =
                error.error?.message || 'Failed to submit review';
              this.alert.showErrorMessage(errorMessage);
            }
          }
        );
    }
  }
}
