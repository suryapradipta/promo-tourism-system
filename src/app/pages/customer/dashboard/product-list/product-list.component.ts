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

  constructor(
    private productListService: ProductListService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.products = this.productListService.getProductsData();
  }

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

  getAverageRating(productId: string): number {
    return this.productListService.getAverageRating(productId);
  }
}
