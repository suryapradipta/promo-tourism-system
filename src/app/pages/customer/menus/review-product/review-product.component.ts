import { Component } from '@angular/core';
import { OrderModel } from '../../../../shared/models';
import {
  AuthService,
  NotificationService,
  ProductListService,
  ReviewService,
} from '../../../../shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-product',
  templateUrl: './review-product.component.html',
  styleUrls: ['./review-product.component.css'],
})
export class ReviewProductComponent {
  unreviewedOrders: OrderModel[] = [];
  showReviewForm = false;
  reviewForm: FormGroup;
  selectedOrderID: string;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private productService: ProductListService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUnreviewedOrders();
    this.initReviewForm();
  }

  get formControl() {
    return this.reviewForm.controls;
  }

  /**
   * Load unreviewed orders for the currently logged-in customer.
   */
  private loadUnreviewedOrders() {
    const loggedInCustomer = this.authService.getCurrentUserJson();
    if (loggedInCustomer) {
      this.unreviewedOrders = this.reviewService.getUnreviewedOrders(
        loggedInCustomer._id
      );
    }
  }

  /**
   * Initialize the review form with form controls for rating and comments.
   */
  private initReviewForm() {
    this.reviewForm = this.formBuilder.group({
      rating: [
        null,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      comment: [null, Validators.required],
    });
  }

  /**
   * Open the review form for the selected order.
   *
   * @param {string} orderID - ID of the selected order.
   */
  openReviewForm(orderID: string) {
    this.showReviewForm = true;
    this.selectedOrderID = orderID;
  }

  /**
   * Submit a product review if the form is valid.
   *
   * @param {string} productID - ID of the product being reviewed.
   */
  submitReview(productID: string) {
    if (this.reviewForm.valid) {
      const orderID = this.selectedOrderID;

      const rating = this.reviewForm.value.rating;
      const comment = this.reviewForm.value.comment;

      const review = this.reviewService.addReview(orderID, +rating, comment);
      this.productService.addReviewToProduct(productID, review);
      console.log('Review submitted:', review);

      this.reviewForm.reset();
      this.showReviewForm = false;
      this.notificationService.showSuccessMessage('Review successful!');

      this.loadUnreviewedOrders();
    }
  }
}
