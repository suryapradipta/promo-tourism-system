import { Product } from './product.model';

export interface Order {
  _id: string;
  product: Product;
  orderNumber: string;
  quantity: number;
  totalAmount: number;
  email: string;
  phoneNumber: number;
  customerId: string;
  merchantId: string;
  createdAt?: string;
  updatedAt?: string;
}
