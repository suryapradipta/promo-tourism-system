/**
 * This component represents the product list, displaying a list of products
 * and allowing users to view product details. It checks the authentication status
 * before allowing users to navigate to the product details page and handles scroll
 * position issues after navigation.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
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
   * Constructor function for ProductListComponent.
   *
   * @constructor
   * @param {ProductListService} productListService - Service for retrieving product data.
   * @param {Router} router - Angular router for navigation.
   * @param {AuthService} authService - Service for managing user authentication.
   */
  constructor(
    private productListService: ProductListService,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Retrieves and sets the product data for display.
   */
  ngOnInit(): void {
    this.products = this.productListService.getProductsData();
  }

  /**
   * Navigate to the product details page when a product is selected.
   * Checks if the user is logged in and handles scroll position issues after navigation.
   * If the user is not logged in, prompt them to log in before proceeding.
   *
   * @param {ProductModel} product - Selected product for which details are to be viewed.
   */
  viewProductDetails(product: ProductModel) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/product', product.id]);

      // [[PROBLEM]] after navigate the scroll position stick on previous page
      // [[BUG]] navigate() persists the scroll position of the previous page
      //solution: https://github.com/reach/router/issues/166
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


  getAverageRating(productId: string): number {
    return this.productListService.getAverageRating(productId);
  }
}
