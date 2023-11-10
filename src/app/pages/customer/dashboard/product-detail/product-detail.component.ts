import { Component } from '@angular/core';
import {ProductModel} from "../../../../shared/models";
import {ActivatedRoute, Router} from "@angular/router";
import {
  OrderService,
  ProductListService
} from "../../../../shared/services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  product: ProductModel | undefined;
  productForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private productListService:ProductListService,
              private router:Router,
              private formBuilder: FormBuilder,
              private orderService: OrderService) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.product = this.productListService.getProductById(productId);

    this.productForm = this.formBuilder.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  onProceedToPayment(product: ProductModel, quantity: number) {
    this.router.navigate(['/product', product.id, 'purchase', { quantity }]);
  }

  incrementQuantity(): void {
    this.productForm.get('quantity').setValue(this.productForm.get('quantity').value + 1);
  }

  decrementQuantity(): void {
    const currentQuantity = this.productForm.get('quantity').value;
    if (currentQuantity > 1) {
      this.productForm.get('quantity').setValue(currentQuantity - 1);
    }
  }

  onBooking(): void {
    if (this.productForm.valid) {
      const productId = this.product.id;
      const quantity = this.productForm.value.quantity;

      this.orderService.createOrder(productId, quantity);

      this.productForm.reset();

      this.onProceedToPayment(this.product, quantity);
    }
  }
}
