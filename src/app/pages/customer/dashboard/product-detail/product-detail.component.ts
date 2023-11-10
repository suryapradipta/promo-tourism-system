import { Component } from '@angular/core';
import {ProductModel} from "../../../../shared/models";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductListService} from "../../../../shared/services";
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
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.product = this.productListService.getProductById(productId);

    this.productForm = this.formBuilder.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  onProceedToPayment(product: ProductModel) {
    this.router.navigate(['/product', product.id, 'purchase']);
  }

  onPurchase(): void {
    if (this.productForm.valid) {
      const productId = this.product.id;
      const quantity = this.productForm.value.quantity;

      // Call a service to create the order
      this.orderService.createOrder(productId, quantity);

      // Reset the form or perform any other actions
      this.productForm.reset();
    }
  }
}
