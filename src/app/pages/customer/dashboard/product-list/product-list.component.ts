import {Component, OnInit} from '@angular/core';
import {ProductModel} from "../../../../shared/models";
import {ProductListService} from "../../../../shared/services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  products: ProductModel[] = [];

  constructor(private productListService: ProductListService, private router: Router) {
  }

  ngOnInit(): void {
    this.products = this.productListService.getProductsData();
  }

  viewProductDetails(product: ProductModel) {
    // Navigate to the product detail page and pass the product ID as a route parameter
    this.router.navigate(['/product', product.id]);

    //[[BUG]] navigate() persists the scroll position of the previous page
    //solution: https://github.com/reach/router/issues/166
    window.scrollTo({ top: 0});
  }
}
