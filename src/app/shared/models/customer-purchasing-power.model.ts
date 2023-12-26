/**
 * Defines the structure of the model representing a customer's purchasing power.
 *
 * @interface CustomerPurchasingPower
 * @property {string} email - Customer's email address.
 * @property {number} totalSpent - Total amount spent by the customer on purchases.
 * @property {number} totalOrders - Total number of orders made by the customer.
 */
export interface CustomerPurchasingPower {
  email: string;
  totalSpent: number;
  totalOrders: number;
}
