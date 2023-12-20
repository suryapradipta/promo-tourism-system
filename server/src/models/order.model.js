/**
 * Mongoose schema for representing order information.
 * @typedef {Object} Order
 * @property {string} orderNumber - The unique order number. Required and unique.
 * @property {mongoose.Types.ObjectId} product - The product associated with the order. Required and references 'Product'.
 * @property {number} quantity - The quantity of the ordered product. Required and must be at least 1.
 * @property {number} totalAmount - The total amount for the order. Required and must be at least 0.
 * @property {string} email - The email associated with the order. Required.
 * @property {number} phoneNumber - The phone number associated with the order. Required.
 * @property {mongoose.Types.ObjectId} customerId - The customer's ID associated with the order. Required and references 'User'.
 * @property {mongoose.Types.ObjectId} merchantId - The merchant's ID associated with the order. Required and references 'Merchant'.
 * @property {Date} createdAt - The timestamp indicating when the order was created.
 * @property {Date} updatedAt - The timestamp indicating when the order was last updated.
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Mongoose schema for the Order model.
 * @type {mongoose.Schema}
 */
const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Order', orderSchema);
