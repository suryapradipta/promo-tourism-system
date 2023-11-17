/**
 * Interface definition for the OrderModel, representing the structure
 * of an order entity in the application.
 * @interface OrderModel
 * @property {string} orderID - Unique identifier for the order.
 * @property {string} productID - Unique identifier for the product associated with the order.
 * @property {string} orderNumber - Unique order number assigned to the order.
 * @property {number} quantity - The quantity of the product in the order.
 * @property {string} email - Email address associated with the order.
 * @property {number} phoneNumber - Phone number associated with the order.
 */
import {ProductModel} from "./product.model";

export interface OrderModel {
  orderID: string;
  product: ProductModel;
  orderNumber: string;
  quantity: number;
  totalAmount: number;
  email: string;
  phoneNumber: number;
  customerID: string;
}
