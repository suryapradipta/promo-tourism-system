import { Injectable } from '@angular/core';
import { ProductModel, ReviewModel } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private products: ProductModel[] = [];

  getProductsData(): ProductModel[] {
    return this.products;
  }


  getProductById(id: string): ProductModel | undefined {
    return this.products.find((product) => product._id === id);
  }


  deleteProduct(productId: string, merchantId: string): void {
    this.products = this.products.filter(
      (p) => p._id !== productId || p.merchantId !== merchantId
    );
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  addReviewToProduct(productId: string, review: ReviewModel): void {
    const product = this.products.find((p) => p._id === productId);

    if (product) {
      product.reviews.push(review);
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  }

  getAverageRating(productId: string): number {
    const product = this.products.find((p) => p._id === productId);

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
