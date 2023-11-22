/**
 * Represents the structure of an order, including essential information
 * such as order ID, associated product details, order number, quantity,
 * total amount, customer email, customer phone number, customer ID, and merchant ID.
 *
 * @interface OrderModel
 * @property {string} orderID - Unique identifier for the order.
 * @property {ProductModel} product - Product details associated with the order.
 * @property {string} orderNumber - Unique order number.
 * @property {number} quantity - Quantity of the product in the order.
 * @property {number} totalAmount - Total amount for the order.
 * @property {string} email - Email address of the customer placing the order.
 * @property {number} phoneNumber - Phone number of the customer placing the order.
 * @property {string} customerID - Unique identifier for the customer placing the order.
 * @property {string} merchantID - Unique identifier for the merchant fulfilling the order.
 */
import { ProductModel } from './product.model';

export interface OrderModel {
  orderID: string;
  product: ProductModel;
  orderNumber: string;
  quantity: number;
  totalAmount: number;
  email: string;
  phoneNumber: number;
  customerID: string;
  merchantID: string;
}
