/**
 * This component manages the display and interaction of a detailed product view, including
 * quantity selection, order creation, and integration with PayPal for payment processing.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
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

  // PayPal configuration for payment processing
  public payPalConfig?: IPayPalConfig;

  constructor(
    private route: ActivatedRoute,
    private productListService: ProductListService,
    private router: Router,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private paymentService: PaymentService,
    private authService : AuthService,
  ) {}

  /**
   * Retrieves product data based on the route parameter and initializes the form.
   */
  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.product = this.productListService.getProductById(productId);

    this.productForm = this.formBuilder.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
    });

    // Initialize PayPal configuration
    this.initConfig();
  }

  /**
   * Getter for form controls to simplify access in the template.
   *
   * @returns {AbstractControl} - The form control.
   */
  get formControl() {
    return this.productForm.controls;
  }

  /**
   * Increment the quantity of the selected product in the form.
   */
  incrementQuantity(): void {
    this.productForm
      .get('quantity')
      .setValue(this.productForm.get('quantity').value + 1);
  }

  /**
   * Decrement the quantity of the selected product in the form, ensuring it stays above 1.
   */
  decrementQuantity(): void {
    const currentQuantity = this.productForm.get('quantity').value;
    if (currentQuantity > 1) {
      this.productForm.get('quantity').setValue(currentQuantity - 1);
    }
  }

  /**
   * Calculate the subtotal of the selected product based on the quantity.
   *
   * @returns {number} - The subtotal.
   */
  get subtotal(): number {
    return this.productForm.value.quantity * this.product.price;
  }

  /**
   * Calculate the tax total based on the subtotal.
   *
   * @returns {number} - The tax total.
   */
  get taxTotal(): number {
    return 0.1 * this.subtotal;
  }

  /**
   * Calculate the total cost, including subtotal and tax.
   *
   * @returns {number} - The total cost.
   */
  get itemTotal(): number {
    return this.subtotal + this.taxTotal;
  }

  /**
   * Process the order if the form is valid, creating an order and resetting the form.
   */
  onBooking(): void {
    if (this.productForm.valid) {
      this.orderService.createOrder(
        this.product.id,
        this.productForm.value.quantity,
        this.itemTotal,
        this.productForm.value.email,
        this.productForm.value.phoneNumber,
        this.authService.getCurrentUser().id
      );
      this.productForm.reset();
    }
  }

  /**
   * Initialize the PayPal configuration for payment processing.
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
        this.notificationService.showSuccessMessage('Transaction successful!');

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
        this.notificationService.showWarningMessage('Transaction canceled!');
      },
      onError: (err) => {
        console.log('OnError', err);
        this.notificationService.showErrorMessage('Transaction failed!');
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      },
    };
  }
}
