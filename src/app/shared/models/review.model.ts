/**
 * Defines the structure of the review model representing user feedback on an order.
 *
 * @interface Review
 * @property {string} _id - Unique identifier for the review.
 * @property {string} orderId - Unique identifier for the associated order.
 * @property {number} rating - Rating given by the user for the order.
 * @property {string} comment - User's comment or feedback on the order.
 * @property {Auth} userId - Reference to the user (Auth) who provided the review.
 * @property {string | undefined} createdAt - Timestamp indicating when the review was created (optional).
 * @property {string | undefined} updatedAt - Timestamp indicating when the review was last updated (optional).
 */
import { Auth } from './auth.model';

export interface Review {
  _id: string;
  orderId: string;
  rating: number;
  comment: string;
  userId: Auth;
  createdAt?: string;
  updatedAt?: string;
}
