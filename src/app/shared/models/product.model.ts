/**
 * Defines the structure of a product, including its attributes such as id, name, description,
 * price, image, category, reviews, and merchantId. The category is constrained to a specific set
 * of values representing different types of products. The reviews property is an array of
 * ReviewModel objects associated with the product.
 *
 * @interface ProductModel
 * @property {string} id - Unique identifier for the product.
 * @property {string} name - Name of the product.
 * @property {string} description - Description of the product.
 * @property {number} price - Price of the product.
 * @property {string} image - URL or path to the product image.
 * @property {"diving" | "cruise" | "honeymoon" | "homestay" | "shopping"} category - Category of the product.
 * @property {ReviewModel[]} reviews - Array of ReviewModel objects associated with the product.
 * @property {string} merchantId - Unique identifier of the merchant associated with the product.
 */
import {ReviewModel} from "./review.model";

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "diving" | "cruise" | "honeymoon" | "homestay" | "shopping";
  reviews: ReviewModel[];
  merchantId: string;
}
