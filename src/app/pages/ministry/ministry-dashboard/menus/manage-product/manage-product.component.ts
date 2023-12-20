/**
 * This component is responsible for managing and displaying products associated with a specific merchant.
 * It interacts with the ProductService, AuthService, MerchantService, NotificationService, and LoadingService
 * for product-related operations, user authentication, merchant identification, and UI notifications.
 */
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../shared/models';
import {
  AuthService,
  LoadingService,
  MerchantService,
  NotificationService,
  ProductService,
} from '../../../../../shared/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css'],
})
export class ManageProductComponent implements OnInit {
  products: Product[] = [];
  merchantId: string | undefined;

  /**
   * @constructor
   * @param {ProductService} productService - The service responsible for product-related operations.
   * @param {Router} router - Angular's router service for navigation.
   * @param {AuthService} authService - The service managing user authentication.
   * @param {MerchantService} merchantService - The service for merchant-related operations.
   * @param {NotificationService} alert - The service for displaying notifications to the user.
   * @param {LoadingService} loading - The service for managing loading indicators.
   */
  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private merchantService: MerchantService,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

  /**
   * Retrieves the current user's email, fetches the associated merchant ID,
   * and loads products associated with the merchant.
   *
   * @async
   * @returns {Promise<void>}
   */
  async ngOnInit(): Promise<void> {
    const email = this.authService.getCurrentUserJson().email;
    const response = await this.merchantService
      .getMerchantIdByEmail(email)
      .toPromise();
    this.merchantId = response.merchantId;
    this.loadProducts(this.merchantId);
  }

  /**
   * Load products associated with the given merchant ID.
   * Displays loading indicators during the operation and handles errors.
   *
   * @param {string} merchantId - The ID of the merchant whose products are to be loaded.
   * @returns {void}
   */
  loadProducts(merchantId: string): void {
    this.loading.show();
    this.productService.getProductsByMerchantId(merchantId).subscribe(
      (products: Product[]) => {
        this.loading.hide();
        this.products = products;
      },
      (error) => {
        this.loading.hide();
        console.error('Error fetching products:', error);
        if (error.status === 404) {
          this.alert.showErrorMessage('Merchant not found.');
        } else if (error.status === 500) {
          this.alert.showErrorMessage(
            'Internal server error. Please try again later.'
          );
        } else {
          this.alert.showErrorMessage(
            error.error?.message ||
              'An unexpected error occurred. Please try again.'
          );
        }
      }
    );
  }

  /**
   * Navigate to the "Add Product" page.
   *
   * @returns {void}
   */
  addProduct(): void {
    this.router.navigate(['/ministry-dashboard/add-product']);
  }

  /**
   * Navigate to the "Edit Product" page for the specified product.
   *
   * @param {Product} product - The product to be edited.
   * @returns {void}
   */
  editProduct(product: Product): void {
    this.router.navigate(['/ministry-dashboard/edit-product', product._id]);
  }

  /**
   * Delete the specified product after user confirmation.
   * Displays a confirmation dialog and handles the deletion process.
   *
   * @param {string} productId - The ID of the product to be deleted.
   * @returns {void}
   */
  deleteProduct(productId: string): void {
    Swal.fire({
      title: 'Are you sure you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Product have been successfully deleted.',
          'success'
        );
        this.loading.show();
        this.productService.deleteProduct(productId).subscribe(
          () => {
            this.loading.hide();
            this.loadProducts(this.merchantId);
          },
          (error) => {
            this.loading.hide();
            if (error.status === 400) {
              this.alert.showErrorMessage('Invalid product ID');
            } else if (error.status === 404) {
              this.alert.showErrorMessage('Product not found');
            } else {
              this.alert.showErrorMessage(
                error.error?.message || 'Failed to delete product'
              );
            }
          }
        );
      }
    });
  }
}
