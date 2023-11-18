import {Component, OnInit} from '@angular/core';
import {MerchantModel, ProductModel} from "../../../../../shared/models";
import {
  NotificationService,
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

  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProductsData();
  }

  addProduct(): void {
    this.router.navigate(['/ministry-dashboard/add-product']);
  }

  editProduct(product: ProductModel): void {
    this.router.navigate(['/ministry-dashboard/edit-product', product.id]);
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
        Swal.fire('Deleted!', 'Product have been successfully deleted.', 'success');
        this.productService.deleteProduct(productId);
        this.products = this.productService.getProductsData();
      }
    });


  }



}
