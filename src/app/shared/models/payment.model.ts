/**
 * Defines the structure of the payment model representing a transaction.
 *
 * @interface Payment
 * @property {string} _id - Unique identifier for the payment transaction.
 * @property {string} orderId - Identifier for the associated order.
 * @property {string} paypalId - Unique identifier for the PayPal transaction.
 * @property {number} amount - Total amount of the payment.
 * @property {number} subTotal - Subtotal amount of the payment.
 * @property {number} taxTotal - Tax amount included in the payment.
 * @property {string} currency_code - Currency code for the payment (e.g., 'USD').
 * @property {string} paymentMethod - Payment method used for the transaction.
 * @property {string} status - Status of the payment transaction.
 * @property {string} shippingName - Name associated with the shipping address.
 * @property {string} addressLine - Street address for the payment transaction.
 * @property {string} admin_area_2 - Administrative area level 2 (e.g., city or town).
 * @property {string} admin_area_1 - Administrative area level 1 (e.g., state or province).
 * @property {string} postal_code - Postal code of the payment transaction.
 * @property {string | undefined} createdAt - Timestamp indicating when the payment transaction was created (optional).
 * @property {string | undefined} updatedAt - Timestamp indicating when the payment transaction was last updated (optional).
 */

export interface Payment {
  _id: string;
  orderId: string;
  paypalId: string;
  amount: number;
  subTotal: number;
  taxTotal: number;
  currency_code: string;
  paymentMethod: string;
  status: string;
  shippingName: string;
  addressLine: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  createdAt?: string;
  updatedAt?: string;
}
