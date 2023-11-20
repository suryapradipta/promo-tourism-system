import {Injectable} from '@angular/core';
import {ProductModel, ReviewModel} from '../models';
import {v4 as uuidv4} from 'uuid';
import {Observable} from "rxjs";
import {PRODUCTS} from "../mock/mock-products";

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private products: ProductModel[] = [];

  constructor() {
    this.initializeData();
    this.loadProductsData();
  }

  private initializeData() {
    this.loadProductsData();
    if (this.products.length === 0) {
      for (const item of PRODUCTS) {
        this.saveProductsData(item);
      }
    }
  }

  private loadProductsData() {
    this.products = JSON.parse(localStorage.getItem('products')) || [];
  }



  getProductsData(): ProductModel[] {
    this.loadProductsData();
    return this.products;
  }

  getProductsByMerchantId(merchantId: string): ProductModel[] {
    return this.products.filter(product => product.merchantId === merchantId);
  }


  private saveProductsData(product: ProductModel) {
    this.products.push(product);
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  getProductById(id: string): ProductModel | undefined {
    return this.products.find((product) => product.id === id);
  }

  addProduct(product: ProductModel, merchantId: string): void {
    product.merchantId = merchantId;
    product.id = uuidv4();
    this.saveProductsData(product);
  }


  updateProduct(product: ProductModel): void {

    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      product.merchantId = this.products[index].merchantId;
      this.products[index] = product;
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  }

  deleteProduct(productId: string, merchantId: string): void {
    this.products = this.products.filter((p) => p.id !== productId || p.merchantId !== merchantId);
    localStorage.setItem('products', JSON.stringify(this.products));
  }


  uploadImage(file: File): Observable<string> {
    const imageUrl = URL.createObjectURL(file);
    return new Observable<string>((observer) => {
      observer.next(imageUrl);
      observer.complete();
    });
  }

  addReviewToProduct(productId: string, review: ReviewModel): void {
    const product = this.products.find((p) => p.id === productId);

    if (product) {
      product.reviews.push(review);
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  }

  getAverageRating(productId: string): number {
    const product = this.products.find((p) => p.id === productId);

    if (product && product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      return totalRating / product.reviews.length;
    }

    return 0; // Default rating if there are no reviews
  }
}
