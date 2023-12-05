import {Component, OnInit} from '@angular/core';
import {
  OrderModel,
  PaymentModel,
  ProductModel,
} from '../../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {
  GenerateReceiptService,
  NotificationService,
  OrderService,
  PaymentService,
  ProductService,
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
  orderDate: string;

  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService,
    private receiptService: GenerateReceiptService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private alert: NotificationService,
  ) {
  }

  ngOnInit(): void {
    try{
      this.route.queryParams.subscribe(async (params) => {
        const productID = params['productID'];
        const paymentID = params['paymentID'];
        const orderID = params['orderID'];

        this.product = await this.productService.getProductById(productID).toPromise();
        this.payment = await this.paymentService.getPaymentByPaypalId(paymentID).toPromise();
        this.order = await this.orderService.getOrderById(orderID).toPromise();


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
    }catch (error) {
      console.error("Error during booking:", error);
      throw error;
    }
  }

  exportToPdf(): void {
    this.receiptService.exportToPdf('receipt_container', 'receipt');
    this.router.navigate(['/']);
    this.alert.showSuccessMessage(
      'Official Receipt Successfully Saved'
    );
  }
}
