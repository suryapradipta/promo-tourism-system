const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  paypalId: { type: String, required: true },
  amount: { type: Number, required: true },
  subTotal: { type: Number, required: true },
  taxTotal: { type: Number, required: true },
  currency_code: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, required: true },
  create_time: { type: Date, default: Date.now },
  update_time: { type: Date, default: Date.now },
  shippingName: String,
  addressLine: String,
  admin_area_2: String,
  admin_area_1: String,
  postal_code: String,
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
