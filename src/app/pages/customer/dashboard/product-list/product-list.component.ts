/**
 * This component displays a list of products and handles navigation to individual
 * product details. It checks the authentication status using the AuthService and
 * prompts the user to log in if necessary.
 */
import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../../shared/models';
import { AuthService, ProductListService } from '../../../../shared/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: ProductModel[] = [];

  /**
   * @constructor
   * @param {ProductListService} productListService - The service responsible for managing product data.
   * @param {Router} router - The Angular router service for navigation.
   * @param {AuthService} authService - The service responsible for user authentication.
   */
  constructor(
    private productListService: ProductListService,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Initializes the product data from the ProductListService.
   */
  ngOnInit(): void {
    this.products = this.productListService.getProductsData();
  }

  /**
   * Navigate to the details page of the selected product.
   * If the user is authenticated, navigate to the product details page and scroll to the top.
   * If not authenticated, prompt the user to log in before navigating.
   *
   * @param {ProductModel} product - The selected product for which details are to be viewed.
   */
  viewProductDetails(product: ProductModel) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/product', product.id]);

      /* [[PROBLEM]] after navigate the scroll position stick on previous page
       [[BUG]] navigate() persists the scroll position of the previous page
      solution: https://github.com/reach/router/issues/166*/
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
   * Get the average rating for a given product.
   *
   * @param {string} productId - The ID of the product for which the average rating is calculated.
   * @returns {number} - The average rating of the product.
   */
  getAverageRating(productId: string): number {
    return this.productListService.getAverageRating(productId);
  }
}
