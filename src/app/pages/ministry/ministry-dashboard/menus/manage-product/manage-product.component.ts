import {Component, OnInit} from '@angular/core';
import {ProductModel} from '../../../../../shared/models';
import {
  AuthService,
  MerchantService,
  NotificationService,
  ProductService,
} from '../../../../../shared/services';
import {Router} from '@angular/router';
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
    private alert: NotificationService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const email = this.authService.getCurrentUserJson().email;
    const response = await this.merchantService.getMerchantIdByEmail(email).toPromise()
    this.merchantId = response.merchantId;
    this.loadProducts(this.merchantId);
  }

  loadProducts(merchantId: string) {
    this.productService.getProductsByMerchantId(merchantId)
      .subscribe(
        (products) => {
          this.products = products;
        },
        (error) => {
          console.error('Error fetching products:', error);
          this.alert.showErrorMessage(error.error.message);
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
          () => {
            this.loadProducts(this.merchantId);
          },
          (error) => {
            this.alert.showErrorMessage(error.error.message);
          }
        );
      }
    });
  }
}
