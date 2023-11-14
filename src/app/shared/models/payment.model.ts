/**
 * Interface definition for the PaymentModel, representing the structure of payment-related data.
 * @interface PaymentModel
 * @property {string} orderId - Unique identifier for the associated order.
 * @property {number} amount - The amount of the payment.
 * @property {string} currency_code - The currency code used for the payment.
 * @property {string} paymentMethod - The method used for the payment (e.g., credit card, PayPal).
 * @property {string} paypalOrderId - Unique identifier for the PayPal transaction, if applicable.
 * @property {string} status - Current status of the payment (e.g., pending, completed).
 * @property {string} create_time - Timestamp indicating the creation time of the payment.
 * @property {string} update_time - Timestamp indicating the last update time of the payment.
 */
export interface PaymentModel {
  orderId: string;
  amount: number;
  currency_code: string;
  paymentMethod: string;
  paypalOrderId: string;
  status: string;
  create_time: string;
  update_time: string;
}
