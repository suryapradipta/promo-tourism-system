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
          name: 'Riverside Retreat in Pitt Meadows',
          description:
            'Escape to the serene beauty of Pitt Meadows, ' +
            'nestled in the heart of British Columbia. ' +
            'Our Riverside Retreat offers a perfect weekend getaway for nature enthusiasts, ' +
            'families, and those seeking a peaceful break.',
          price: 399,
          image: 'tour-package1.jpg',
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Sacred Serenity: Pura Batur Spiritual Retreat',
          description:
            'Nestled against the backdrop of the majestic Mount Batur, this experience promises a harmonious blend of spirituality, culture, and natural beauty.',
          price: 699,
          image: 'tour-package2.jpg',
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Sun-Kissed Serenity: Tropical Beach Escape',
          description:
            'Picture yourself on a pristine sandy shore, surrounded by azure waters and swaying palm trees. This tropical retreat is designed for those seeking pure relaxation and seaside bliss.',
          price: 149,
          image: 'tour-package3.jpg',
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Enchanted Family Escape: Disneyland Adventure',
          description: 'Create lifelong memories as you step into a world of fantasy, meet beloved characters, and experience the thrill of iconic rides in the heart of the magic kingdom.',
          price: 200,
          image: 'tour-package4.jpg',
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Northern Bliss: Vågan Fjord Adventure',
          description: 'Immerse yourself in the breathtaking landscapes of majestic fjords, charming fishing villages, and the mesmerizing Northern Lights.',
          price: 269,
          image: 'tour-package5.jpg',
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Canal Charm: A Romantic Getaway',
          description: 'Our "Canal Charm" package invites you to experience the magic of meandering water channels, historic architecture, and intimate moments in this picturesque destination.',
          price: 90,
          image: 'tour-package6.jpg',
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Adriatic Tranquility: Split-Dalmatia Escape',
          description: 'Our "Adriatic Tranquility" escape invites you to explore charming coastal towns, indulge in local cuisine, and relax in the beauty of this Croatian paradise.',
          price: 69,
          image: 'tour-package7.jpg',
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Adriatic Odyssey: Discover Split-Dalmatia Magic',
          description: 'Explore historic cities, relax on pristine beaches, and savor the rich flavors of Croatian cuisine.',
          price: 125,
          image: 'tour-package8.jpg',
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
