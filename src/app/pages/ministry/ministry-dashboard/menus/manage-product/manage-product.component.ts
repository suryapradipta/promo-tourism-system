import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../../../shared/models';
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
  products: ProductModel[] = [];
  merchantId: string | undefined;

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private merchantService: MerchantService,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

  async ngOnInit(): Promise<void> {
    const email = this.authService.getCurrentUserJson().email;
    const response = await this.merchantService
      .getMerchantIdByEmail(email)
      .toPromise();
    this.merchantId = response.merchantId;
    this.loadProducts(this.merchantId);
  }

  loadProducts(merchantId: string): void {
    this.loading.show();
    this.productService.getProductsByMerchantId(merchantId).subscribe(
      (products: ProductModel[]) => {
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

  addProduct(): void {
    this.router.navigate(['/ministry-dashboard/add-product']);
  }

  editProduct(product: ProductModel): void {
    this.router.navigate(['/ministry-dashboard/edit-product', product._id]);
  }

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
