/**
 * This service manages product-related operations, including retrieval, addition, updating,
 * and deletion of products. It also provides functionality for uploading images,
 * adding reviews to products, and calculating the average rating of a product.
 */
import { Injectable } from '@angular/core';
import { ProductModel, ReviewModel } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { PRODUCTS } from '../mock/mock-products';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private products: ProductModel[] = [];

  /**
   * Initializes the service, loads product data from local storage, and
   * initializes mock product data if no existing data is found.
   *
   * @constructor
   */
  constructor() {
    this.initializeData();
    this.loadProductsData();
  }

  /**
   * Loads existing product data from local storage, and if no data is found,
   * initializes the data with mock product data.
   */
  private initializeData() {
    this.loadProductsData();
    if (this.products.length === 0) {
      for (const item of PRODUCTS) {
        this.saveProductsData(item);
      }
    }
  }

  /**
   * Private method to load product data from local storage.
   */
  private loadProductsData() {
    this.products = JSON.parse(localStorage.getItem('products')) || [];
  }

  /**
   * Get all products.
   *
   * @returns {ProductModel[]} - Array of product data.
   */
  getProductsData(): ProductModel[] {
    this.loadProductsData();
    return this.products;
  }

  /**
   * Get products associated with a specific merchant ID.
   *
   * @param {string} merchantId - ID of the merchant.
   * @returns {ProductModel[]} - Array of products associated with the specified merchant.
   */
  getProductsByMerchantId(merchantId: string): ProductModel[] {
    return this.products.filter((product) => product.merchantId === merchantId);
  }

  /**
   * Private method to save product data to local storage.
   *
   * @param {ProductModel} product - Product data to be saved.
   */
  private saveProductsData(product: ProductModel) {
    this.products.push(product);
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  /**
   * Get a product by its ID.
   *
   * @param {string} id - ID of the product.
   * @returns {ProductModel | undefined} - Product data or undefined if not found.
   */
  getProductById(id: string): ProductModel | undefined {
    return this.products.find((product) => product.id === id);
  }

  /**
   * Add a new product.
   *
   * @param {ProductModel} product - Product data to be added.
   * @param {string} merchantId - ID of the merchant associated with the product.
   */
  addProduct(product: ProductModel, merchantId: string): void {
    product.merchantId = merchantId;
    product.id = uuidv4();
    this.saveProductsData(product);
  }

  /**
   * Update an existing product.
   *
   * @param {ProductModel} product - Updated product data.
   */
  updateProduct(product: ProductModel): void {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      product.merchantId = this.products[index].merchantId;
      this.products[index] = product;
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  }

  /**
   * Delete a product.
   *
   * @param {string} productId - ID of the product to be deleted.
   * @param {string} merchantId - ID of the merchant associated with the product.
   */
  deleteProduct(productId: string, merchantId: string): void {
    this.products = this.products.filter(
      (p) => p.id !== productId || p.merchantId !== merchantId
    );
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  /**
   * Upload an image and return the observable containing the image URL.
   *
   * @param {File} file - File containing the image to be uploaded.
   * @returns {Observable<string>} - Observable containing the image URL.
   */
  uploadImage(file: File): Observable<string> {
    const imageUrl = URL.createObjectURL(file);
    return new Observable<string>((observer) => {
      observer.next(imageUrl);
      observer.complete();
    });
  }

  /**
   * Add a review to a specific product.
   *
   * @param {string} productId - ID of the product to which the review is added.
   * @param {ReviewModel} review - Review data to be added.
   */
  addReviewToProduct(productId: string, review: ReviewModel): void {
    const product = this.products.find((p) => p.id === productId);

    if (product) {
      product.reviews.push(review);
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  }

  /**
   * Get the average rating of a product based on its reviews.
   *
   * @param {string} productId - ID of the product.
   * @returns {number} - Average rating of the product.
   */
  getAverageRating(productId: string): number {
    const product = this.products.find((p) => p.id === productId);

    if (product && product.reviews.length > 0) {
      const totalRating = product.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      return totalRating / product.reviews.length;
    }

    return 0; // Default rating if there are no reviews
  }
}
