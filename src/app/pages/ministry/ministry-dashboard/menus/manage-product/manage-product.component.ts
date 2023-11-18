import {Component, OnInit} from '@angular/core';
import {ProductModel} from "../../../../../shared/models";
import {
  AuthService,
  ProductListService
} from "../../../../../shared/services";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit{
  products: ProductModel[] = [];

  constructor(
    private productService: ProductListService,
    private router: Router,
    private authService:AuthService

  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProductsByMerchantId(this.authService.getCurrentUser().id);
  }

  addProduct(): void {
    this.router.navigate(['/ministry-dashboard/add-product']);
  }

  editProduct(product: ProductModel): void {
    this.router.navigate(['/ministry-dashboard/edit-product', product.id]);
  }

  deleteProduct(productId: string, merchantId: string): void {
    Swal.fire({
      title: 'Are you sure you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Product have been successfully deleted.', 'success');
        this.productService.deleteProduct(productId, merchantId);
        this.products = this.productService.getProductsByMerchantId(this.authService.getCurrentUser().id);
      }
    });
  }
}
