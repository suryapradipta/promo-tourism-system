import {
  Component,
  OnInit
} from '@angular/core';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductModel} from "../../../../shared/models";
import {ProductListService} from "../../../../shared/services";

declare var paypal;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit{
  product: ProductModel | undefined;

  constructor(private route: ActivatedRoute,
              private productListService:ProductListService, private router:Router) {}


  paidFor = false;
  public payPalConfig ? : IPayPalConfig;

  quantity:number = 1;




  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.product = this.productListService.getProductById(productId);

    this.route.params.subscribe(params => {
      this.quantity = params['quantity'];
      console.log('Quantity from route:', this.quantity);
    });

    this.initConfig();
  }


  private initConfig(): void {

    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AXbp6-Ojon_2I2t6ACCq9gipRPGN9LjAOtYgZjDewvuI97s0DmoWTXLFrHgyzDXK-owvAgm4ptEBLIEQ',
      createOrderOnClient: (data) => < ICreateOrderRequest > {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: (this.product.price * this.quantity).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: (this.product.price * this.quantity).toFixed(2),
              }
            }
          },
          items: [{
            name: this.product.name,
            quantity: this.quantity.toString(),
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: this.product.price.toFixed(2),
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // this.showSuccess = true;
        this.paidFor=true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        // this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      }
    };
  }

}
