/**
 * Defines the structure of a payment object, capturing essential information
 * related to a transaction, such as order details, payment amount, currency,
 * payment method, PayPal order ID, transaction status, and timestamps.
 *
 * @interface PaymentModel
 * @property {string} orderId - Unique identifier for the order associated with the payment.
 * @property {number} amount - The amount of the payment.
 * @property {string} currency_code - The currency code for the payment amount.
 * @property {string} paymentMethod - The payment method used for the transaction.
 * @property {string} paypalOrderId - The PayPal order ID associated with the payment.
 * @property {string} status - The status of the payment transaction.
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
