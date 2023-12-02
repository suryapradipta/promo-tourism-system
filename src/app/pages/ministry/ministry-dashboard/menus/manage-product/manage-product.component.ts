import {Component, OnInit} from '@angular/core';
import {ProductModel} from '../../../../../shared/models';
import {
  AuthService,
  MerchantService,
  NotificationService,
} from '../../../../../shared/services';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {
  ProductService
} from "../../../../../shared/services/product.service";

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
    private alert: NotificationService
  ) {
  }

  ngOnInit(): void {
    const email = this.authService.getCurrentUserJson().email;
    this.merchantService.getMerchantIdByEmail(email)
      .subscribe((data) => {
          this.loadProducts(data.merchantId);
        },
        (error) => {
          console.error('Error fetching merchant ID:', error);
          if (error.status === 500) {
            this.alert.showErrorMessage('Internal server error. Please try again later.');
          } else {
            this.alert.showErrorMessage('An unexpected error occurred. Please try again.');
          }
        }
      );
  }

  loadProducts(merchantId: string) {
    this.productService.getProductsByMerchantId(merchantId)
      .subscribe(
        (products) => {
          this.products = products;
          console.log(this.products)
        },
        (error) => {
          console.error('Error fetching products:', error);
          if (error.status === 404) {
            this.alert.showErrorMessage('Merchant not found.');
          } else if (error.status === 500) {
            this.alert.showErrorMessage('Internal server error. Please try again later.');
          } else {
            this.alert.showErrorMessage('An unexpected error occurred. Please try again.');
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
        this.productService.deleteProduct(productId).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.error(error);
          }
        );
      }
    });
  }
}
