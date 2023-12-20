import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

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

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-product/${productId}`);
  }

  getProductsByMerchantId(merchantId: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/by-merchant/${merchantId}`
    );
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getAverageRating(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/average-rating/${productId}`);
  }

  getReviewsForProduct(productId: string): Observable<any[]> {
    const url = `${this.apiUrl}/products/${productId}/reviews`;
    return this.http.get<any[]>(url);
  }
}
