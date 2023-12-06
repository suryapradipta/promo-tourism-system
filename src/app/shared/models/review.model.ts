import {AuthModel} from "./auth.model";

export interface ReviewModel {
  _id: string;
  orderId: string;
  rating: number;
  comment: string;
  userId: AuthModel;
  createdAt: string;
  updatedAt: string;
}
