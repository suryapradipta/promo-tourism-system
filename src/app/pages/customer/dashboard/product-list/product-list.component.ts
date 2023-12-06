import {Component, OnInit} from '@angular/core';
import {ProductModel} from '../../../../shared/models';
import {
  AuthService,
  ProductListService,
  ProductService
} from '../../../../shared/services';
import {Router} from '@angular/router';
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
    private authService: AuthService,
    private productService: ProductService
  ) {
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
        this.fetchAverageRatings(products);
      },
      (error) => {
        console.error(error);
      }
    );
  }


  viewProductDetails(product: ProductModel) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/product', product._id]);
      window.scrollTo({top: 0});
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

  private fetchAverageRatings(products: ProductModel[]): void {
    for (const product of products) {
      this.productService.getAverageRating(product._id).subscribe(
        (response) => {
          product.averageRating = response.averageRating;
        },
        (error) => {
          console.error(error);
        }
      );
    }

    this.products = products;
  }
}
