/**
 * This component is responsible for displaying and exporting order receipts.
 * It retrieves product, payment, and order information based on query parameters,
 * and additional address details from route parameters. It uses the GenerateReceiptService
 * to export the receipt as a PDF and notifies the user upon successful save.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */
import { Component, OnInit } from '@angular/core';
import {
  OrderModel,
  PaymentModel,
  ProductModel,
} from '../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GenerateReceiptService,
  NotificationService,
  OrderService,
  PaymentService,
  ProductListService,
} from '../../../../shared/services';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  // Data models for product, payment, and order
  product: ProductModel;
  payment: PaymentModel;
  order: OrderModel;

  // Address details
  orderDate: string;
  shippingName: string;
  addressLine: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;

  /**
   * Constructor function for ReceiptComponent.
   *
   * @constructor
   * @param {ActivatedRoute} route - The Angular service for interacting with route parameters.
   * @param {ProductListService} productListService - The service for managing product information.
   * @param {PaymentService} paymentService - The service for managing payment information.
   * @param {OrderService} orderService - The service for managing order information.
   * @param {GenerateReceiptService} receiptService - The service for generating and exporting receipts.
   * @param {Router} router - The Angular service for navigation.
   * @param {NotificationService} notificationService - The service for displaying notifications.
   */
  constructor(
    private route: ActivatedRoute,
    private productListService: ProductListService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private receiptService: GenerateReceiptService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  /**
   * Retrieves product, payment, and order details based on query parameters and
   * additional address details from route parameters. Formats the order date for display.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const productID = params['productID'];
      const paymentID = params['paymentID'];
      const orderID = params['orderID'];

      this.product = this.productListService.getProductById(productID);
      this.payment = this.paymentService.getPaymentById(paymentID);
      this.order = this.orderService.getOrderById(orderID);

      this.route.params.subscribe((params) => {
        this.shippingName = params['shippingName'];
        this.addressLine = params['addressLine'];
        this.admin_area_2 = params['admin_area_2'];
        this.admin_area_1 = params['admin_area_1'];
        this.postal_code = params['postal_code'];
      });

      // Format the order date for display
      this.orderDate = new Date(this.payment.update_time).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      );
    });
  }

  /**
   * Exports the receipt as a PDF using the GenerateReceiptService,
   * navigates back to the home page, and displays a success notification.
   */
  exportToPdf(): void {
    this.receiptService.exportToPdf('receipt_container', 'receipt');
    this.router.navigate(['/']);
    this.notificationService.showSuccessMessage(
      'Official Receipt Successfully Saved'
    );
  }
}
