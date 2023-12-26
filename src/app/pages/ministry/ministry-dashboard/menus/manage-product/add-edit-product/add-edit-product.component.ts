/**
 * This component handles the addition and editing of products. It interacts with the ProductService
 * and MerchantService to fetch and update product data, as well as manage image uploads and form submissions.
 */
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../../shared/models';
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
  product: Product = {
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

  /**
   * @constructor
   * @param {ActivatedRoute} route - Service to interact with the current route information.
   * @param {Router} router - Service to interact with the application's route navigation.
   * @param {NotificationService} alert - Service to display notifications to the user.
   * @param {AuthService} authService - Service for user authentication-related functionality.
   * @param {ProductService} productService - Service for product-related functionality.
   * @param {MerchantService} merchantService - Service for merchant-related functionality.
   * @param {LoadingService} loading - Service to manage loading indicators during asynchronous operations.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alert: NotificationService,
    private authService: AuthService,
    private productService: ProductService,
    private merchantService: MerchantService,
    private loading: LoadingService
  ) {}

  /**
   * Fetches product and merchant information based on the route parameters and the current user's email.
   */
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

  /**
   * Event handler for image upload input.
   * Updates the selected image file and triggers the image preview update.
   *
   * @param {any} event - The input event containing the selected image file.
   */
  handleImageUpload(event: any): void {
    this.imageFile = event.target.files[0];
    this.loadImagePreview(this.imageFile);
  }

  /**
   * Load image preview based on the selected or existing product image.
   *
   * @param {File} [file] - Optional file parameter for updating the preview based on a new image file.
   */
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

  /**
   * Save product data based on the form submission.
   * Handles both product editing and addition scenarios.
   *
   * @param {NgForm} form - The NgForm containing the product data.
   */
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
                error.error?.message ||
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
            this.alert.showErrorMessage(
              error.error?.message || 'All fields are required'
            );
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
