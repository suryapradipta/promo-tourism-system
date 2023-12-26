/**
 * Mongoose schema for representing payment information.
 * @typedef {Object} Payment
 * @property {mongoose.Types.ObjectId} orderId - The ID of the associated order. Required.
 * @property {string} paypalId - The PayPal transaction ID. Required.
 * @property {number} amount - The total payment amount. Required and must be a non-negative number.
 * @property {number} subTotal - The subtotal amount. Required and must be a non-negative number.
 * @property {number} taxTotal - The total tax amount. Required and must be a non-negative number.
 * @property {string} currency_code - The currency code of the payment. Required and trimmed.
 * @property {string} paymentMethod - The payment method used. Required and trimmed.
 * @property {string} status - The status of the payment. Required.
 * @property {string} shippingName - The name associated with the shipping address. Trimmed.
 * @property {string} addressLine - The street address. Trimmed.
 * @property {string} admin_area_2 - The city or locality. Trimmed.
 * @property {string} admin_area_1 - The state or province. Trimmed.
 * @property {string} postal_code - The postal code. Trimmed.
 * @property {Date} createdAt - The timestamp indicating when the payment was created.
 * @property {Date} updatedAt - The timestamp indicating when the payment was last updated.
 */

const mongoose = require('mongoose');

/**
 * Mongoose schema for the Payment model.
 * @type {mongoose.Schema}
 */
const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    paypalId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    subTotal: { type: Number, required: true, min: 0 },
    taxTotal: { type: Number, required: true, min: 0 },
    currency_code: { type: String, required: true, trim: true },
    paymentMethod: { type: String, required: true, trim: true },
    status: { type: String, required: true },
    shippingName: { type: String, trim: true },
    addressLine: { type: String, trim: true },
    admin_area_2: { type: String, trim: true },
    admin_area_1: { type: String, trim: true },
    postal_code: { type: String, trim: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
