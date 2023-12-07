export interface PaymentModel {
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
