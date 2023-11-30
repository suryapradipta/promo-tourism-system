/**
 * This component manages the details and interactions related to a specific product,
 * including quantity selection, order creation, and PayPal payment integration.
 */
import { Component } from '@angular/core';
import { PaymentModel, ProductModel } from '../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  NotificationService,
  OrderService,
  PaymentService,
  ProductListService,
} from '../../../../shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  product: ProductModel | undefined;
  productForm: FormGroup;

  // PayPal's configuration for payment processing
  public payPalConfig?: IPayPalConfig;

  /**
   * @constructor
   * @param {ActivatedRoute} route - Angular service to access the route information.
   * @param {ProductListService} productService - Service to retrieve product details.
   * @param {Router} router - Angular service for navigation.
   * @param {FormBuilder} formBuilder - Angular service for building and managing forms.
   * @param {OrderService} orderService - Service for managing user orders.
   * @param {NotificationService} alert - Service for displaying notifications.
   * @param {PaymentService} paymentService - Service for managing payment-related data.
   * @param {AuthService} authService - Service for managing user authentication.
   */
  constructor(
    private route: ActivatedRoute,
    private productService: ProductListService,
    private router: Router,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private alert: NotificationService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  /**
   * Retrieves the product details based on the route parameter, initializes the form,
   * and sets up the PayPal configuration.
   */
  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.product = this.productService.getProductById(productId);

    this.productForm = this.formBuilder.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
    });

    // Initialize PayPal configuration
    this.initConfig();
  }

  /**
   * Getter function for easy access to form controls.
   */
  get formControl() {
    return this.productForm.controls;
  }

  /**
   * Increase the quantity of the selected product.
   */
  incrementQuantity(): void {
    this.productForm
      .get('quantity')
      .setValue(this.productForm.get('quantity').value + 1);
  }

  /**
   * Decrease the quantity of the selected product, ensuring it does not go below 1.
   */
  decrementQuantity(): void {
    const currentQuantity = this.productForm.get('quantity').value;
    if (currentQuantity > 1) {
      this.productForm.get('quantity').setValue(currentQuantity - 1);
    }
  }

  /**
   * Calculate the subtotal of the order.
   *
   * @returns {number} - Subtotal amount.
   */
  get subtotal(): number {
    return this.productForm.value.quantity * this.product.price;
  }

  /**
   * Calculate the tax total based on the subtotal.
   *
   * @returns {number} - Tax total amount.
   */
  get taxTotal(): number {
    return 0.1 * this.subtotal;
  }

  /**
   * Calculate the total amount of the order, including tax.
   *
   * @returns {number} - Total amount.
   */
  get itemTotal(): number {
    return this.subtotal + this.taxTotal;
  }

  /**
   * Calculate the average rating of the product.
   *
   * @returns {number} - Average product rating.
   */
  get averageRating(): number {
    return this.productService.getAverageRating(this.product.id);
  }

  /**
   * Handle the booking process when the user clicks on the "Book Now" button.
   * If the form is valid, create an order, reset the form, and display a success message.
   */
  onBooking(): void {
    if (this.productForm.valid) {
      this.orderService.createOrder(
        this.product,
        this.productForm.value.quantity,
        this.itemTotal,
        this.productForm.value.email,
        this.productForm.value.phoneNumber,
        this.authService.getCurrentUserJson()._id,
        this.product.merchantId
      );
      this.productForm.reset();
    }
  }

  /**
   * Initialize the PayPal configuration with the necessary details for payment processing.
   */
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId:
        'AXbp6-Ojon_2I2t6ACCq9gipRPGN9LjAOtYgZjDewvuI97s0DmoWTXLFrHgyzDXK-owvAgm4ptEBLIEQ',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          // Create order request details
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.itemTotal.toFixed(2),
                breakdown: {
                  // Breakdown of the amount
                  item_total: {
                    currency_code: 'USD',
                    value: (
                      this.product.price * this.productForm.value.quantity
                    ).toFixed(2),
                  },
                  tax_total: {
                    currency_code: 'USD',
                    value: this.taxTotal.toFixed(2),
                  },
                },
              },
              items: [
                // Item details for the PayPal transaction
                {
                  name: this.product.name,
                  quantity: this.productForm.value.quantity.toString(),
                  unit_amount: {
                    currency_code: 'USD',
                    value: this.product.price.toFixed(2),
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );

        this.onBooking();
        this.alert.showSuccessMessage('Transaction successful!');

        const orders = this.orderService.getOrdersData();
        const orderID = orders[orders.length - 1].orderID;

        const payment: PaymentModel = {
          amount: Number(data.purchase_units[0].amount.value),
          create_time: data.create_time,
          currency_code: data.purchase_units[0].amount.currency_code,
          orderId: orderID,
          paymentMethod: 'PayPal',
          paypalOrderId: data.id,
          status: data.status,
          update_time: data.update_time,
        };
        this.paymentService.savePaymentsData(payment);

        const productID = this.product.id;
        const paymentID = data.id;
        const { name, address } = data.purchase_units[0].shipping;
        const { full_name: shippingName } = name;
        const {
          address_line_1: addressLine,
          admin_area_2,
          admin_area_1,
          postal_code,
        } = address;
        this.router.navigate(
          [
            '/receipt',
            {
              shippingName,
              addressLine,
              admin_area_2,
              admin_area_1,
              postal_code,
            },
          ],
          {
            queryParams: { productID, paymentID, orderID },
          }
        );
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
        // this.resetStatus();
      },
    };
  }
}
