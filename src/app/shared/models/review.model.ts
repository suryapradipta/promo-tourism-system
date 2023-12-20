import {Auth} from "./auth.model";

export interface Review {
  _id: string;
  orderId: string;
  rating: number;
  comment: string;
  userId: Auth;
  createdAt?: string;
  updatedAt?: string;
}
