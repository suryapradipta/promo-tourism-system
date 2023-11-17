
import {ReviewModel} from "./review.model";

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  reviews: ReviewModel[];
}
