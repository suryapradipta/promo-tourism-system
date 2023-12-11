import { Component, OnInit } from '@angular/core';
import { AuthModel, OrderModel } from '../../../../shared/models';
import {
  AuthService,
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
  unreviewedOrders: OrderModel[] = [];
  showReviewForm = false;
  reviewForm: FormGroup;
  selectedOrderId: string;

  constructor(
    private formBuilder: FormBuilder,
    private alert: NotificationService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUnreviewedOrders();
    this.initReviewForm();
  }

  get formControl() {
    return this.reviewForm.controls;
  }

  private loadUnreviewedOrders(): void {
    const user: AuthModel = this.authService.getCurrentUserJson();

    if (user) {
      this.reviewService.getUnreviewedOrders(user._id).subscribe(
        (response: OrderModel[]) => {
          this.unreviewedOrders = response;
        },
        (error) => {
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

  formatOrderDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private initReviewForm(): void {
    this.reviewForm = this.formBuilder.group({
      rating: [
        null,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      comment: [null, Validators.required],
    });
  }

  openReviewForm(orderId: string): void {
    this.showReviewForm = true;
    this.selectedOrderId = orderId;
  }

  closeReviewForm(): void {
    this.showReviewForm = false;
    this.selectedOrderId = null;
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      const orderId: string = this.selectedOrderId;
      const userId = this.authService.getCurrentUserJson()._id;

      const rating = this.reviewForm.value.rating;
      const comment = this.reviewForm.value.comment;

      this.reviewService
        .submitReview(orderId, +rating, comment, userId)
        .subscribe(
          (response) => {
            this.reviewForm.reset();
            this.showReviewForm = false;
            this.loadUnreviewedOrders();
            this.alert.showSuccessMessage(response.message);
          },
          (error) => {
            console.error('Error submitting review:', error);

            if (error.status === 404) {
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
