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
