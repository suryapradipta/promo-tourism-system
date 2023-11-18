import {ReviewModel} from "./review.model";

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "diving" | "cruise" | "honeymoon" | "homestay" | "shopping";
  reviews: ReviewModel[];
}
