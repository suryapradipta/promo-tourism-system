/**
 * Defines the structure of the product model, representing an item available for purchase or review.
 *
 * @interface Product
 * @property {string} _id - Unique identifier for the product.
 * @property {string} name - Name of the product.
 * @property {string} description - Description of the product.
 * @property {number} price - Price of the product.
 * @property {string} image - URL or path to the product's image.
 * @property {'Diving' | 'Cruise' | 'Honeymoon' | 'Homestay' | 'Shopping'} category - Category of the product.
 * @property {Review[]} reviews - Array of reviews associated with the product.
 * @property {string} merchantId - Unique identifier of the merchant associated with the product.
 * @property {number | undefined} averageRating - Average rating of the product based on reviews (optional).
 * @property {string | undefined} createdAt - Timestamp indicating when the product was created (optional).
 * @property {string | undefined} updatedAt - Timestamp indicating when the product was last updated (optional).
 */
import { Review } from './review.model';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Diving' | 'Cruise' | 'Honeymoon' | 'Homestay' | 'Shopping';
  reviews: Review[];
  merchantId: string;
  averageRating?: number;
  createdAt?: string;
  updatedAt?: string;
}
