import { Component, OnInit } from '@angular/core';
import {
  OrderModel,
  PaymentModel,
  ProductModel,
} from '../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GenerateReceiptService, NotificationService,
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
  product: ProductModel;
  payment: PaymentModel;
  order: OrderModel;
  orderDate: string;
  shippingName: string;
  addressLine: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;

  constructor(
    private route: ActivatedRoute,
    private productListService: ProductListService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private receiptService: GenerateReceiptService,
    private router: Router,
    private notificationService:NotificationService
  ) {}

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

  exportToPdf(): void {
    this.receiptService.exportToPdf('receipt_container', 'receipt');
    this.router.navigate(['/']);
    this.notificationService.showSuccessMessage('Official Receipt Successfully Saved')

  }

  /*handleExport(){


    const invoiceContentElement=document.getElementById('receipt_container') as HTMLElement;

    // Convert HTMLCollection to an array
    const elementsToHide = Array.from(invoiceContentElement.getElementsByClassName('hide-in-pdf'));

    // Hide elements with class 'hide-in-pdf' before capturing the HTML content
    elementsToHide.forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });

    html2canvas(invoiceContentElement,{}).then(canvas=>{
      // convert the canvas into base64 string url
      const imgData=canvas.toDataURL('image/png');

      const pageWidth = 210;
      const pageHeight = 297;
      // calculate the image actual height to fit width canvas and pdf
      const height = canvas.height*pageWidth/canvas.width;
      // init pdf
      const doc = new jsPDF("p","mm", "a4");

      // add image into pdf
      doc.addImage(imgData, 'PNG', 0, 0, pageWidth, height);
      doc.save('receipt.pdf');
    })
  }*/
}
