import {Component} from '@angular/core';
import {OrderModel} from '../../../../shared/models';
import {
  AuthService,
  NotificationService,
  ReviewService,
} from '../../../../shared/services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-review-product',
  templateUrl: './review-product.component.html',
  styleUrls: ['./review-product.component.css'],
})
export class ReviewProductComponent {
  unreviewedOrders: OrderModel[] = [];
  showReviewForm = false;
  reviewForm: FormGroup;
  selectedOrderId: string;


  constructor(
    private formBuilder: FormBuilder,
    private alert: NotificationService,
    private reviewService: ReviewService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.loadUnreviewedOrders();
    this.initReviewForm();
  }

  get formControl() {
    return this.reviewForm.controls;
  }

  private loadUnreviewedOrders() {
    const user = this.authService.getCurrentUserJson();

    if (user) {
      this.reviewService.getUnreviewedOrders(user._id)
        .subscribe(
          (response) => {
            this.unreviewedOrders = response;
            console.log('Unreviewed orders retrieved successfully:', response);
          },
          (error) => {
            console.error(error);
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

  private initReviewForm() {
    this.reviewForm = this.formBuilder.group({
      rating: [
        null,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      comment: [null, Validators.required],
    });
  }

  openReviewForm(orderId: string) {
    this.showReviewForm = true;
    this.selectedOrderId = orderId;
  }

  closeReviewForm() {
    this.showReviewForm = false;
    this.selectedOrderId = null;
  }


  submitReview() {
    if (this.reviewForm.valid) {
      const orderId = this.selectedOrderId;
      const userId = this.authService.getCurrentUserJson()._id;

      const rating = this.reviewForm.value.rating;
      const comment = this.reviewForm.value.comment;


      this.reviewService.submitReview(orderId, +rating, comment, userId).subscribe(
        (response) => {
          console.log('Review submitted successfully');
          this.reviewForm.reset();
          this.showReviewForm = false;
          this.loadUnreviewedOrders();
        },
        (error) => {
          // Handle error
          console.error(error);
        }
      );


    }
  }
}
