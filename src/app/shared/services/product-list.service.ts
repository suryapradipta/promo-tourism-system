/**
 * This service manages the list of products, providing functionality for retrieving,
 * adding, and initializing product data. It uses local storage to persist product information.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Injectable } from '@angular/core';
import {ProductModel, ReviewModel} from '../models';
import { v4 as uuidv4 } from 'uuid';
import {Observable} from "rxjs";

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
          image: 'assets/images/tour-package1.jpg',
          category: "cruise",
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Sacred Serenity: Pura Batur Spiritual Retreat',
          description:
            'Nestled against the backdrop of the majestic Mount Batur, this experience promises a harmonious blend of spirituality, culture, and natural beauty.',
          price: 699,
          image: 'assets/images/tour-package2.jpg',
          category: "shopping",
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Sun-Kissed Serenity: Tropical Beach Escape',
          description:
            'Picture yourself on a pristine sandy shore, surrounded by azure waters and swaying palm trees. This tropical retreat is designed for those seeking pure relaxation and seaside bliss.',
          price: 149,
          image: 'assets/images/tour-package3.jpg',
          category: "diving",
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Enchanted Family Escape: Disneyland Adventure',
          description: 'Create lifelong memories as you step into a world of fantasy, meet beloved characters, and experience the thrill of iconic rides in the heart of the magic kingdom.',
          price: 200,
          image: 'assets/images/tour-package4.jpg',
          category: "shopping",
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Northern Bliss: Vågan Fjord Adventure',
          description: 'Immerse yourself in the breathtaking landscapes of majestic fjords, charming fishing villages, and the mesmerizing Northern Lights.',
          price: 269,
          image: 'assets/images/tour-package5.jpg',
          category: "cruise",
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Canal Charm: A Romantic Getaway',
          description: 'Our "Canal Charm" package invites you to experience the magic of meandering water channels, historic architecture, and intimate moments in this picturesque destination.',
          price: 90,
          image: 'assets/images/tour-package6.jpg',
          category: "shopping",
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Adriatic Tranquility: Split-Dalmatia Escape',
          description: 'Our "Adriatic Tranquility" escape invites you to explore charming coastal towns, indulge in local cuisine, and relax in the beauty of this Croatian paradise.',
          price: 69,
          image: 'assets/images/tour-package7.jpg',
          category: "homestay",
          reviews: [],
        },
        {
          id: uuidv4(),
          name: 'Adriatic Odyssey: Discover Split-Dalmatia Magic',
          description: 'Explore historic cities, relax on pristine beaches, and savor the rich flavors of Croatian cuisine.',
          price: 125,
          image: 'assets/images/tour-package8.jpg',
          category: "honeymoon",
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

  addProduct(product: ProductModel): void {

    product.id = uuidv4();
    this.saveProductsData(product);
  }


  updateProduct(product: ProductModel): void {
    // Add logic to update the product in the database
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  }

  deleteProduct(productId: string): void {
    // Add logic to delete the product from the database
    this.products = this.products.filter((p) => p.id !== productId);
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
