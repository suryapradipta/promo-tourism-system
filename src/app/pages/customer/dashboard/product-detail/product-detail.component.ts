import { Component } from '@angular/core';
import {
  Order,
  Payment,
  Product,
  Review,
} from '../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  LoadingService,
  NotificationService,
  OrderService,
  PaymentService,
  ProductService,
} from '../../../../shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPayPalConfig } from 'ngx-paypal';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  product: Product | undefined;
  productForm: FormGroup;
  orderResponse: any;
  averageRating: number;
  reviews: Review[];

  // PayPal's configuration for payment processing
  public payPalConfig?: IPayPalConfig;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private alert: NotificationService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private productService: ProductService,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.initializeProductForm();
    this.fetchProductDetails();
  }

  ngAfterViewInit(): void {
    // Initialize PayPal configuration
    this.initConfig();
  }

  private initializeProductForm(): void {
    this.productForm = this.formBuilder.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
    });
  }

  private fetchProductDetails(): void {
    const productId: string = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.loading.show();
      this.productService.getProductById(productId).subscribe(
        (product: Product): void => {
          this.product = product;

          this.productService.getAverageRating(this.product._id).subscribe(
            (response) => {
              this.loading.hide();
              this.averageRating = response.averageRating;
            },
            (error) => {
              this.loading.hide();
              console.error('Error while fetching average rating:', error);
            }
          );
        },
        (error) => {
          this.loading.hide();
          console.error('Error fetching product:', error);
        }
      );

      this.fetchReviews(productId);
    }
  }

  private fetchReviews(productId: string): void {
    this.loading.show();
    this.productService.getReviewsForProduct(productId).subscribe(
      (response: any[]) => {
        this.loading.hide();
        this.reviews = response;
      },
      (error) => {
        this.loading.hide();
        console.error('Error fetching reviews:', error);
      }
    );
  }

  formatOrderDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  get formControl() {
    return this.productForm.controls;
  }

  incrementQuantity(): void {
    this.productForm
      .get('quantity')
      .setValue(this.productForm.get('quantity').value + 1);
  }

  decrementQuantity(): void {
    const currentQuantity = this.productForm.get('quantity').value;
    if (currentQuantity > 1) {
      this.productForm.get('quantity').setValue(currentQuantity - 1);
    }
  }

  get subtotal(): number {
    return this.productForm.value.quantity * this.product.price;
  }

  get taxTotal(): number {
    return 0.1 * this.subtotal;
  }

  get itemTotal(): number {
    return this.subtotal + this.taxTotal;
  }

  async onBooking(): Promise<void> {
    try {
      if (this.productForm.valid) {
        const order: Order = {
          orderNumber: null,
          _id: null,
          product: this.product,
          quantity: this.productForm.value.quantity,
          totalAmount: this.itemTotal,
          email: this.productForm.value.email,
          phoneNumber: this.productForm.value.phoneNumber,
          customerId: this.authService.getCurrentUserJson()._id,
          merchantId: this.product.merchantId,
        };

        this.orderResponse = await this.orderService
          .createOrder(order)
          .toPromise();
      }
    } catch (error) {
      console.error('Error during booking:', error);
    }
  }

  private initConfig(): void {
    this.payPalConfig = {
      clientId:
        'AXbp6-Ojon_2I2t6ACCq9gipRPGN9LjAOtYgZjDewvuI97s0DmoWTXLFrHgyzDXK-owvAgm4ptEBLIEQ',
      createOrderOnServer: (data) => {
        return fetch(
          'http://localhost:3000/api/payments/create-paypal-transaction',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product: this.product,
              itemTotal: this.itemTotal.toFixed(2),
              itemTotalValue: this.subtotal.toFixed(2),
              taxTotalValue: this.taxTotal.toFixed(2),
              quantity: this.productForm.value.quantity.toString(),
            }),
          }
        )
          .then((res) => res.json())
          .then((order) => order.orderID);
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details) => {
          console.log(
            'onApprove - get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - inform your server about completed transaction at this point',
          data
        );
        this.loading.show();
        this.onBooking()
          .then(() => {
            const productID = this.product._id;
            const paymentID = data.id;
            const orderID = this.orderResponse.orderId;

            const {
              name: { full_name: shippingName },
              address: {
                address_line_1: addressLine,
                admin_area_2,
                admin_area_1,
                postal_code,
              },
            } = data.purchase_units[0].shipping;

            const payment: Payment = {
              _id: null,
              orderId: orderID,
              paypalId: paymentID,
              amount: +data.purchase_units[0].amount.value,
              subTotal: +this.subtotal.toFixed(2),
              taxTotal: +this.taxTotal.toFixed(2),
              currency_code: data.purchase_units[0].amount.currency_code,
              paymentMethod: 'PayPal',
              status: data.status,
              shippingName,
              addressLine,
              admin_area_2,
              admin_area_1,
              postal_code,
            };
            this.alert.showSuccessMessage(this.orderResponse.message);

            this.paymentService.savePayment(payment).subscribe(
              (savedPayment: Payment) => {
                this.loading.hide();
                console.log('Payment saved:', savedPayment);
              },
              (error) => {
                this.loading.hide();
                console.error('Error saving payment:', error);
                if (error.status === 400) {
                  this.alert.showErrorMessage(
                    'Invalid payment data. Please check your input.'
                  );
                } else if (error.status === 500) {
                  this.alert.showErrorMessage(
                    'Internal server error. Please try again later.'
                  );
                } else {
                  const errorMessage =
                    error.error?.message || 'Failed to save payment.';
                  this.alert.showErrorMessage(errorMessage);
                }
              }
            );

            this.router.navigate(['/receipt'], {
              queryParams: { productID, paymentID, orderID },
            });
          })
          .catch((error) => {
            this.loading.hide();
            console.error('Booking failed. Error:', error);
            if (error.status === 400) {
              this.alert.showErrorMessage(
                'Validation error. Please check your input.'
              );
            } else if (error.status === 500) {
              this.alert.showErrorMessage(
                'Server error. Please try again later.'
              );
            } else {
              this.alert.showErrorMessage(
                error.error?.message ||
                  'An unexpected error occurred during booking.'
              );
            }
          });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.alert.showWarningMessage('Transaction canceled!');
      },
      onError: (err) => {
        console.log('OnError', err);
        this.alert.showErrorMessage('Transaction failed!');
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
