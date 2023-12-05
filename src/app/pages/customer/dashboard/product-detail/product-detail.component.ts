import {Component} from '@angular/core';
import {
  OrderModel,
  PaymentModel,
  ProductModel
} from '../../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {
  AuthService,
  NotificationService,
  OrderService,
  PaymentService,
  ProductListService,
  ProductService,
} from '../../../../shared/services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IPayPalConfig} from 'ngx-paypal';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  product: ProductModel | undefined;
  productForm: FormGroup;
  orderResponse;


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
    private productListService: ProductListService,
    private productService: ProductService,
  ) {
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productService.getProductById(productId).subscribe(
        (product) => {
          this.product = product;
        },
        (error) => {
          console.error('Error fetching product:', error);
        }
      );
    }

    this.productForm = this.formBuilder.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
    });

    // Initialize PayPal configuration
    this.initConfig();
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

  get averageRating(): number {
    return this.productListService.getAverageRating(this.product._id);
  }


  async onBooking(): Promise<void> {
    try{
      if (this.productForm.valid) {

        const order: OrderModel = {
          orderNumber: null,
          _id: null,
          product: this.product,
          quantity: this.productForm.value.quantity,
          totalAmount: this.itemTotal,
          email: this.productForm.value.email,
          phoneNumber: this.productForm.value.phoneNumber,
          customerID: this.authService.getCurrentUserJson()._id,
          merchantID: this.product.merchantId
        };

        this.orderResponse = await this.orderService.createOrder(order).toPromise();
      }
    } catch (error) {
      // Handle the error here
      console.error("Error during booking:", error);
      // Optionally, you can rethrow the error to propagate it to the calling code
      throw error;
    }
  }


  private initConfig(): void {
    this.payPalConfig = {
      clientId: 'AXbp6-Ojon_2I2t6ACCq9gipRPGN9LjAOtYgZjDewvuI97s0DmoWTXLFrHgyzDXK-owvAgm4ptEBLIEQ',
      createOrderOnServer: (data) => {
        return fetch('http://localhost:3000/api/payments/create-paypal-transaction', {
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
        })
          .then((res) => res.json())
          .then((order) => order.orderID);
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - inform your server about completed transaction at this point', data);
        this.onBooking()
          .then(() => {
          console.log("Booking successful. Response:", this.orderResponse);
            const productID = this.product._id;
            const paymentID = data.id;
            const orderID = this.orderResponse.orderId;

            const {name, address} = data.purchase_units[0].shipping;
            const {full_name: shippingName} = name;
            const {
              address_line_1: addressLine,
              admin_area_2,
              admin_area_1,
              postal_code,
            } = address;


            const payment: PaymentModel = {
              _id: null,
              orderId: orderID,
              paypalId: paymentID,
              amount: Number(data.purchase_units[0].amount.value),
              subTotal: Number(this.subtotal.toFixed(2)),
              taxTotal: Number(this.taxTotal.toFixed(2)),
              currency_code: data.purchase_units[0].amount.currency_code,
              paymentMethod: 'PayPal',
              status: data.status,
              create_time: data.create_time,
              update_time: data.update_time,
              shippingName,
              addressLine,
              admin_area_2,
              admin_area_1,
              postal_code
            };

            this.alert.showSuccessMessage(this.orderResponse.message);
            this.paymentService.savePayment(payment).subscribe(
              (savedPayment) => {
                console.log('Payment saved:', savedPayment);
              },
              (error) => {
                console.error('Error saving payment:', error);
              }
            );

            this.router.navigate(
              ['/receipt'],
              {queryParams: { productID, paymentID, orderID }}
            );

          })
          .catch((error) => {
            console.error("Booking failed. Error:", error);
          });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.alert.showWarningMessage('Transaction canceled!');

      },
      onError: err => {
        console.log('OnError', err);
        this.alert.showErrorMessage('Transaction failed!');
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
