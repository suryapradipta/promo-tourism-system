/**
 * Interface definition for the ProductModel, representing the structure of product information.
 * @interface ProductModel
 * @property {string} id - Unique identifier for the product.
 * @property {string} name - Name of the product.
 * @property {string} description - Description providing details about the product.
 * @property {number} price - Price of the product.
 * @property {string} image - URL or path to the product's image.
 * @property {number} ratings - Numeric value representing product ratings.
 */
export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ratings: number;
}
