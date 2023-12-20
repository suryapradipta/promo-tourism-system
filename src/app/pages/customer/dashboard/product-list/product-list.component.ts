import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../shared/models';
import {
  AuthService,
  LoadingService,
  NotificationService,
  ProductService,
} from '../../../../shared/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private productService: ProductService,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.loading.show();
    this.productService.getAllProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
        this.fetchAverageRatings(products);
      },
      (error) => {
        this.loading.hide();
        console.error('Error fetching products:', error);

        if (error.status === 404) {
          this.alert.showErrorMessage('No products found');
        } else {
          this.alert.showErrorMessage(
            error.error?.message ||
              'Failed to fetch products. Please try again later.'
          );
        }
      }
    );
  }

  viewProductDetails(product: Product): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/product', product._id]);
      window.scrollTo({ top: 0 });
    } else {
      Swal.fire({
        title: 'Welcome! To make a purchase, please',
        showCancelButton: true,
        confirmButtonText: 'Log In',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/sign-in']);
        }
      });
    }
  }

  private fetchAverageRatings(products: Product[]): void {
    for (const product of products) {
      this.productService.getAverageRating(product._id).subscribe(
        (response) => {
          this.loading.hide();
          product.averageRating = response.averageRating;
        },
        (error) => {
          this.loading.hide();
          console.error('Error while fetching average rating:', error);
        }
      );
    }

    this.products = products;
  }
}
