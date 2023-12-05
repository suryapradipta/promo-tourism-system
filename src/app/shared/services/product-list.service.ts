import {Injectable} from '@angular/core';
import {ProductModel, ReviewModel} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private products: ProductModel[] = [];

  getProductsData(): ProductModel[] {
    return this.products;
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
