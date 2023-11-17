import { Component } from '@angular/core';
import {OrderModel} from "../../../../shared/models";
import {
  AuthService,
  ProductListService,
  ReviewService
} from "../../../../shared/services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-review-product',
  templateUrl: './review-product.component.html',
  styleUrls: ['./review-product.component.css']
})
export class ReviewProductComponent {
  unreviewedOrders: OrderModel[] = [];
  showReviewForm = false;
  reviewForm: FormGroup;

  constructor(private reviewService: ReviewService,
              private authService: AuthService,
              private productService: ProductListService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loadUnreviewedOrders();
    this.initReviewForm();
  }

  private loadUnreviewedOrders() {
    const loggedInCustomer = this.authService.getCurrentUser();
    if (loggedInCustomer) {
      this.unreviewedOrders = this.reviewService.getUnreviewedOrders(loggedInCustomer.id);
    }
  }

  private initReviewForm() {
    this.reviewForm = this.formBuilder.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: [null, Validators.required],
    });
  }

  openReviewForm(orderID: string) {
    this.showReviewForm = true;
  }

  onReview() {
    const loggedInCustomer = this.authService.getCurrentUser();
    if (!loggedInCustomer) {
      // Handle the case where the customer is not logged in
      return;
    }

    const orderID = '';

    const rating = this.reviewForm.value.rating;
    const comment = this.reviewForm.value.comment;

    const review = this.reviewService.addReview(orderID, +rating, comment);
    console.log('Review submitted:', review);

    // Reset the form and hide the review form
    this.reviewForm.reset();
    this.showReviewForm = false;

    // Reload the list of unreviewed orders after submitting a review
    this.loadUnreviewedOrders();
  }
}
