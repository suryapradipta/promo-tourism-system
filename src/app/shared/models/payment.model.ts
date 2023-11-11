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
