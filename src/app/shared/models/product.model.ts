import { ReviewModel } from './review.model';

export interface ProductModel {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Diving' | 'Cruise' | 'Honeymoon' | 'Homestay' | 'Shopping';
  reviews: ReviewModel[];
  merchantId: string;
  averageRating?: number;
  createdAt?: string;
  updatedAt?: string;
}
