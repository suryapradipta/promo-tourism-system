import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  NotificationService,
  ProductListService,
} from '../../../../../../shared/services';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css'],
})
export class AddEditProductComponent implements OnInit {
  product: ProductModel = {
    category: undefined,
    description: '',
    id: '',
    image: '',
    name: '',
    price: 0,
    reviews: [],
    merchantId: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductListService,
    private alert: NotificationService,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.product = this.productService.getProductById(productId);
    }
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productService.uploadImage(file).subscribe((imageUrl) => {
        this.product.image = imageUrl;
      });
    }
  }


  saveProduct(form: NgForm): void {
    if (form.invalid) {
      this.alert.showErrorMessage(
        'Your product data invalid. Please check your information.'
      );
      return;
    }
    const merchantId = this.authService.getCurrentUser().id;
    this.product.merchantId = merchantId;

    if (this.product.id) {
      this.alert.showSuccessMessage('Update product successful!');
      this.productService.updateProduct(this.product);
    } else {
      this.alert.showSuccessMessage('Add product successful!');
      this.productService.addProduct(this.product, merchantId);
    }

    this.router.navigate(['/ministry-dashboard/manage-product']);
  }
}
