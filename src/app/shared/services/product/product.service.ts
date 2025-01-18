/**
 * This service interacts with the server's product-related API endpoints, providing
 * functionality for adding, editing, deleting, and retrieving product information.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  /**
   * @constructor
   * @param {HttpClient} http - Angular's HTTP client for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Add a new product along with an associated image file.
   *
   * @param {Product} product - The product information to be added.
   * @param {File} imageFile - The image file associated with the product.
   * @returns {Observable<any>} - Observable representing the result of the addition.
   */
  addProduct(product: Product, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('category', product.category);
    formData.append('merchantId', product.merchantId);
    formData.append('image', imageFile);

    return this.http.post(`${this.apiUrl}/add-product`, formData);
  }

  /**
   * Edit an existing product along with an optional updated image file.
   *
   * @param {string} productId - The ID of the product to be edited.
   * @param {Product} product - The updated product information.
   * @param {File} imageFile - The updated image file associated with the product.
   * @returns {Observable<any>} - Observable representing the result of the edit operation.
   */
  editProduct(
    productId: string,
    product: Product,
    imageFile: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('category', product.category);
    formData.append('image', imageFile);

    return this.http.put<any>(
      `${this.apiUrl}/edit-product/${productId}`,
      formData
    );
  }

  /**
   * Delete an existing product by its ID.
   *
   * @param {string} productId - The ID of the product to be deleted.
   * @returns {Observable<any>} - Observable representing the result of the delete operation.
   */
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-product/${productId}`);
  }

  /**
   * Get all products associated with a specific merchant.
   *
   * @param {string} merchantId - The ID of the merchant for whom products are requested.
   * @returns {Observable<Product[]>} - Observable containing an array of products.
   */
  getProductsByMerchantId(merchantId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/by-merchant/${merchantId}`);
  }

  /**
   * Get a specific product by its ID.
   *
   * @param {string} productId - The ID of the product to be retrieved.
   * @returns {Observable<Product>} - Observable containing the product information.
   */
  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  /**
   * Get all products available in the system.
   *
   * @returns {Observable<Product[]>} - Observable containing an array of all products.
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * Get the average rating for a specific product.
   *
   * @param {string} productId - The ID of the product for which the average rating is requested.
   * @returns {Observable<any>} - Observable containing the average rating.
   */
  getAverageRating(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/average-rating/${productId}`);
  }

  /**
   * Get reviews for a specific product by its ID.
   *
   * @param {string} productId - The ID of the product for which reviews are requested.
   * @returns {Observable<any[]>} - Observable containing an array of product reviews.
   */
  getReviewsForProduct(productId: string): Observable<any[]> {
    const url = `${this.apiUrl}/products/${productId}/reviews`;
    return this.http.get<any[]>(url);
  }
}
