/**
 * This component displays the details of a receipt, including product information,
 * payment details, and order information. It allows users to export the receipt to PDF.
 */
import { Component, OnInit } from '@angular/core';
import { Order, Payment, Product } from '../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LoadingService,
  NotificationService,
  OrderService,
  PaymentService,
  ProductService,
} from '../../../../shared/services';
import { ReceiptService } from '../../../../shared/services/receipt/receipt.service';
import { FileUrlService } from '../../../../shared/services/file/file-url.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  product: Product;
  payment: Payment;
  order: Order;
  orderDate: string;

  /**
   * @constructor
   * @param {PaymentService} paymentService - The service for managing payment-related operations.
   * @param {OrderService} orderService - The service for managing order-related operations.
   * @param {ReceiptService} receiptService - The service for exporting receipts to PDF.
   * @param {ProductService} productService - The service for managing product-related operations.
   * @param {ActivatedRoute} route - The route for accessing URL parameters.
   * @param {Router} router - The router for navigating between components.
   * @param {NotificationService} alert - The service for displaying notification messages.
   * @param {LoadingService} loading - The service for displaying loading indicators.
   * @param {FileUrlService} fileUrlService - The service for generating file URLs.
   */
  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService,
    private receiptService: ReceiptService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private alert: NotificationService,
    private loading: LoadingService,
    private fileUrlService: FileUrlService
  ) {}

  /**
   * It retrieves and displays the receipt details based on the provided parameters.
   */
  ngOnInit(): void {
    this.loading.show();
    this.route.queryParams.subscribe(async (params) => {
      try {
        await this.loadData(params);
      } catch (error) {
        this.loading.hide();
        console.error('Error during loading data:', error);
      }
    });
  }

  /**
   * Private method to load data based on the provided parameters.
   * Retrieves product, payment, and order details and formats the order date.
   *
   * @param {any} params - URL parameters containing productID, paymentID, and orderID.
   * @returns {Promise<void>} - Promise that resolves once data loading is complete.
   */
  private async loadData(params: any): Promise<void> {
    const productID = params['productID'];
    const paymentID = params['paymentID'];
    const orderID = params['orderID'];

    this.product = await this.productService
      .getProductById(productID)
      .toPromise();
    this.payment = await this.paymentService
      .getPaymentByPaypalId(paymentID)
      .toPromise();
    this.order = await this.orderService.getOrderById(orderID).toPromise();

    this.orderDate = ReceiptComponent.formatOrderDate(this.payment.createdAt);
    this.loading.hide();
  }

  /**
   * Formats the order date in a user-friendly format.
   *
   * @param {string} date - The date to be formatted.
   * @returns {string} - Formatted date string.
   */
  private static formatOrderDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Exports the receipt to PDF and navigates back to the home page.
   */
  exportToPdf(): void {
    this.receiptService.exportToPdf('receipt_container', 'receipt');
    this.router
      .navigate(['/'])
      .then(() =>
        this.alert.showSuccessMessage('Official Receipt Successfully Saved')
      );
  }

  getFileUrl(filename: string): string {
    return this.fileUrlService.getFileUrl(filename);
  }
}
