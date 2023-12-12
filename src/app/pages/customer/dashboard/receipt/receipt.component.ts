import { Component, OnInit } from '@angular/core';
import {
  OrderModel,
  PaymentModel,
  ProductModel,
} from '../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LoadingService,
  NotificationService,
  OrderService,
  PaymentService,
  ProductService,
} from '../../../../shared/services';
import { ReceiptService } from '../../../../shared/services/receipt/receipt.service';

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
  orderDate: string;

  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService,
    private receiptService: ReceiptService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

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

  private static formatOrderDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  exportToPdf(): void {
    this.receiptService.exportToPdf('receipt_container', 'receipt');
    this.router
      .navigate(['/'])
      .then(() =>
        this.alert.showSuccessMessage('Official Receipt Successfully Saved')
      );
  }
}
