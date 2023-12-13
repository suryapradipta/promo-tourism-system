import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  LoadingService,
  MerchantService,
  NotificationService,
  ProductService,
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
    _id: '',
    image: null,
    name: '',
    price: 0,
    reviews: [],
    merchantId: '',
  };
  imageFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alert: NotificationService,
    private authService: AuthService,
    private productService: ProductService,
    private merchantService: MerchantService,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loading.show();
      this.productService.getProductById(productId).subscribe(
        (product) => {
          this.loading.hide();
          this.product = product;
          this.loadImagePreview();
        },
        (error) => {
          this.loading.hide();
          console.error('Error fetching product:', error);
        }
      );
    }

    const email = this.authService.getCurrentUserJson().email;
    this.loading.show();
    this.merchantService.getMerchantIdByEmail(email).subscribe(
      (data) => {
        this.loading.hide();
        this.product.merchantId = data.merchantId;
      },
      (error) => {
        this.loading.hide();
        console.error('Error fetching merchant ID:', error);
      }
    );
  }

  handleImageUpload(event: any): void {
    this.imageFile = event.target.files[0];
    this.loadImagePreview(this.imageFile);
  }

  loadImagePreview(file?: File): void {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result;
      };
      reader.readAsDataURL(file);
    } else if (this.product.image) {
      this.previewImage = `http://localhost:3000/api/files/server/src/uploads/${this.product.image}`;
    }
  }

  saveProduct(form: NgForm): void {
    if (form.invalid) {
      this.alert.showErrorMessage(
        'Your product data invalid. Please check your information.'
      );
      return;
    }

    if (!this.imageFile && !this.product.image) {
      this.alert.showErrorMessage('Image file is required');
      return;
    }

    if (this.product._id) {
      this.loading.show();
      this.productService
        .editProduct(this.product._id, this.product, this.imageFile)
        .subscribe(
          (response) => {
            this.loading.hide();
            this.router
              .navigate(['/ministry-dashboard/manage-product'])
              .then(() => this.alert.showSuccessMessage(response.message));
          },
          (error) => {
            this.loading.hide();
            console.error('Error updating product:', error);

            if (error.status === 404) {
              this.alert.showErrorMessage(
                'Product not found. Please refresh and try again.'
              );
            } else if (error.status === 400) {
              this.alert.showErrorMessage(
                'All fields are required. Please fill in all details.'
              );
            } else {
              this.alert.showErrorMessage(
                error.error?.message ||
                  'Edit product failed. Please try again later.'
              );
            }
          }
        );
    } else {
      this.loading.show();
      this.productService.addProduct(this.product, this.imageFile).subscribe(
        (response) => {
          this.loading.hide();
          this.router
            .navigate(['/ministry-dashboard/manage-product'])
            .then(() => this.alert.showSuccessMessage(response.message));
        },
        (error) => {
          this.loading.hide();
          console.error('Error while adding product:', error);

          if (error.status === 400) {
            this.alert.showErrorMessage('All fields are required');
          } else if (error.status === 500) {
            this.alert.showErrorMessage(
              'Internal server error. Please try again later.'
            );
          } else {
            this.alert.showErrorMessage(
              error.error?.message ||
                'Add product failed. Please try again later.'
            );
          }
        }
      );
    }
  }
}
