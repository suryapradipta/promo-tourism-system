/**
 * Defines the structure of a review, including its unique identifier (id),
 * the associated order's identifier (orderID), a numerical rating, and an optional comment.
 *
 * @interface ReviewModel
 * @property {string} id - Unique identifier for the review.
 * @property {string} orderID - Identifier of the associated order for the review.
 * @property {number} rating - Numerical rating given in the review.
 * @property {string} comment - Optional comment associated with the review.
 */
export interface ReviewModel {
  id: string;
  orderID: string;
  rating: number;
  comment: string;
}
