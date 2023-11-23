/**
 * Defines the structure of the PurchasingPowerModel, which represents
 * purchasing power information for users based on their email addresses.
 * It includes the total amount spent and the total number of orders made by each user.
 *
 * @interface PurchasingPowerModel
 * @property {number} totalSpent - The total amount spent by the user.
 * @property {number} totalOrders - The total number of orders made by the user.
 */
export interface PurchasingPowerModel {
  [email: string]: {
    totalSpent: number;
    totalOrders: number;
  };
}
