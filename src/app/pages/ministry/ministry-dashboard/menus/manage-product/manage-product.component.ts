/**
 * This component is responsible for managing products, displaying a list of products
 * associated with the currently logged-in ministry user. It provides functionality
 * to add, edit, and delete products. The product list is retrieved from the ProductListService,
 * and product deletion is confirmed using SweetAlert2.
 */
import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../../../shared/models';
import {
  AuthService,
  ProductListService,
} from '../../../../../shared/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css'],
})
export class ManageProductComponent implements OnInit {
  products: ProductModel[] = [];

  /**
   * Constructor function for ManageProductComponent.
   *
   * @constructor
   * @param {ProductListService} productService - The service for managing product data.
   * @param {Router} router - The Angular router service for navigation.
   * @param {AuthService} authService - The service for managing user authentication.
   */
  constructor(
    private productService: ProductListService,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Retrieves the list of products associated with the currently logged-in ministry user.
   */
  ngOnInit(): void {
    this.products = this.productService.getProductsByMerchantId(
      this.authService.getCurrentUserJson().id
    );
  }
  /**
   * Navigate to the 'add-product' route for adding a new product.
   */
  addProduct(): void {
    this.router.navigate(['/ministry-dashboard/add-product']);
  }

  /**
   * Navigate to the 'edit-product' route for editing the selected product.
   *
   * @param {ProductModel} product - The product to be edited.
   */
  editProduct(product: ProductModel): void {
    this.router.navigate(['/ministry-dashboard/edit-product', product.id]);
  }

  /**
   * Delete the selected product after confirming the action using SweetAlert2.
   *
   * @param {string} productId - The ID of the product to be deleted.
   * @param {string} merchantId - The ID of the merchant associated with the product.
   */
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
        Swal.fire(
          'Deleted!',
          'Product have been successfully deleted.',
          'success'
        );
        this.productService.deleteProduct(productId, merchantId);
        this.products = this.productService.getProductsByMerchantId(
          this.authService.getCurrentUserJson().id
        );
      }
    });
  }
}
