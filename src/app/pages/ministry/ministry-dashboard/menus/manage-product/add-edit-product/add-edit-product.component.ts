/**
 * This component handles the addition and editing of products. It utilizes the ProductService
 * for managing product data, AuthService for obtaining the current user's information, and
 * NotificationService for displaying alerts. It also includes methods for handling image uploads
 * and saving product data.
 */
import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AuthService,
  NotificationService,
  ProductListService,
} from '../../../../../../shared/services';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css'],
})
export class AddEditProductComponent implements OnInit {
  // Object to hold product data
  product: ProductModel = {
    category: undefined,
    description: '',
    id: '',
    image: '',
    name: '',
    price: 0,
    reviews: [],
    merchantId: '',
  };

  /**
   * Constructor function for AddEditProductComponent.
   *
   * @constructor
   * @param {ActivatedRoute} route - Used to retrieve route parameters.
   * @param {Router} router - Used for navigation.
   * @param {ProductListService} productService - Service for managing product data.
   * @param {NotificationService} alert - Service for displaying notifications.
   * @param {AuthService} authService - Service for managing user authentication.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductListService,
    private alert: NotificationService,
    private authService: AuthService
  ) {}

  /**
   * Retrieves the product ID from the route parameters and loads the corresponding
   * product data if in edit mode.
   */
  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.product = this.productService.getProductById(productId);
    }
  }

  /**
   * Method to handle image uploads. It sends the selected image file to the ProductService
   * for upload and updates the product's image URL upon successful upload.
   *
   * @param {any} event - The event containing the selected image file.
   */
  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productService.uploadImage(file).subscribe((imageUrl) => {
        this.product.image = imageUrl;
      });
    }
  }

  /**
   * Method to save product data. Validates the form, sets the merchant ID based on the
   * current user, and either adds a new product or updates an existing one based on the
   * presence of a product ID.
   * Navigates to the product management page after successful save.
   *
   * @param {NgForm} form - The NgForm containing the product data.
   */
  saveProduct(form: NgForm): void {
    if (form.invalid) {
      this.alert.showErrorMessage(
        'Your product data invalid. Please check your information.'
      );
      return;
    }
    const merchantId = this.authService.getCurrentUser().id;
    this.product.merchantId = merchantId;

    if (this.product.id) {
      this.alert.showSuccessMessage('Update product successful!');
      this.productService.updateProduct(this.product);
    } else {
      this.alert.showSuccessMessage('Add product successful!');
      this.productService.addProduct(this.product, merchantId);
    }

    this.router.navigate(['/ministry-dashboard/manage-product']);
  }
}
