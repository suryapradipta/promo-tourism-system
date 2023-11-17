/**
 * This service manages the list of products, providing functionality for retrieving,
 * adding, and initializing product data. It uses local storage to persist product information.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Injectable } from '@angular/core';
import {ProductModel, ReviewModel} from '../models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private products: ProductModel[] = [];

  /**
   * Constructor function for ProductListService.
   * Initializes the service and loads existing product data from local storage.
   */
  constructor() {
    this.initializeData();
    this.loadProductsData();
  }

  /**
   * Private method to initialize product data, adding default products if none exist.
   */
  private initializeData() {
    this.loadProductsData();
    if (this.products.length === 0) {
      const initialProducts: ProductModel[] = [
        {
          id: uuidv4(),
          name: 'Tour Package 1',
          description:
            'Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves. Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves.Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves.Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves.Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves.Pitt Meadows, BC, Canada with beautiful turquoise water and sea waves.',
          price: 50,
          image: 'tour-package1.jpg',
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Tour Package 2',
          description:
            'Ocean seashore with beautiful turquoise water and sea waves.',
          price: 60,
          image: 'tour-package2.jpg',
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Tour Package 3',
          description:
            'Tourist walking towards historical architectural monument.',
          price: 85,
          image: 'tour-package3.jpg',
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Tour Package 4',
          description: 'Bell tower part of ensemble of city cathedral.',
          price: 45,
          image: 'tour-package4.jpg',
          reviews: [],
        },
      ];

      for (const product of initialProducts) {
        this.saveProductsData(product);
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
   * Get the current list of products.
   *
   * @returns {ProductModel[]} - Array of product data.
   */
  getProductsData(): ProductModel[] {
    this.loadProductsData();
    return this.products;
  }

  /**
   * Private method to save product data to local storage.
   *
   * @param {ProductModel} product - The product to be saved.
   */
  private saveProductsData(product: ProductModel) {
    this.products.push(product);
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  /**
   * Get a product by its unique identifier.
   *
   * @param {string} id - The unique identifier of the product.
   * @returns {ProductModel | undefined} - The product with the specified ID or undefined if not found.
   */
  getProductById(id: string): ProductModel | undefined {
    return this.products.find((product) => product.id === id);
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
