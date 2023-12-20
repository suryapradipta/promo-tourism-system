/**
 * Defines the structure of the order model representing a customer's purchase.
 *
 * @interface Order
 * @property {string} _id - Unique identifier for the order.
 * @property {Product} product - Product associated with the order.
 * @property {string} orderNumber - Unique order number.
 * @property {number} quantity - Quantity of the product in the order.
 * @property {number} totalAmount - Total amount for the order.
 * @property {string} email - Customer's email address.
 * @property {number} phoneNumber - Customer's phone number.
 * @property {string} customerId - Unique identifier for the customer.
 * @property {string} merchantId - Unique identifier for the merchant associated with the order.
 * @property {string | undefined} createdAt - Timestamp indicating when the order was created (optional).
 * @property {string | undefined} updatedAt - Timestamp indicating when the order was last updated (optional).
 */

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
