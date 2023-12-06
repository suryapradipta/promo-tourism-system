import { ProductModel } from './product.model';

export interface OrderModel {
  _id: string;
  product: ProductModel;
  orderNumber: string;
  quantity: number;
  totalAmount: number;
  email: string;
  phoneNumber: number;
  customerId: string;
  merchantId: string;
  createdAt: string;
  updatedAt: string;
}
