/**
 * This component displays a list of products and handles user interactions,
 * such as viewing product details. It utilizes various services for product retrieval,
 * authentication checks, and displaying notifications.
 */
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../shared/models';
import {
  AuthService,
  LoadingService,
  NotificationService,
  ProductService,
  FileUrlService,
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

  /**
   * @constructor
   * @param {Router} router - Angular router service for navigation.
   * @param {AuthService} authService - Authentication service for checking user authentication status.
   * @param {ProductService} productService - Service for retrieving product-related data.
   * @param {NotificationService} alert - Service for displaying notifications.
   * @param {LoadingService} loading - Service for managing loading indicators.
   * @param {FileUrlService} fileUrlService - Service for generating file URLs.
   */
  constructor(
    private router: Router,
    private authService: AuthService,
    private productService: ProductService,
    private alert: NotificationService,
    private loading: LoadingService,
    private fileUrlService: FileUrlService
  ) {}

  /**
   * Fetches the list of products and their average ratings.
   */
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

  /**
   * Navigate to the details page of a selected product.
   * If the user is not authenticated, prompt them to log in.
   *
   * @param {Product} product - The selected product.
   */
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

  /**
   * Fetch the average ratings for each product in the list.
   *
   * @param {Product[]} products - The list of products.
   */
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

  getFileUrl(filename: string): string {
    return this.fileUrlService.getFileUrl(filename);
  }
}
