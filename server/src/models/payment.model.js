const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  paypalId: {type: String, required: true},
  amount: {type: Number, required: true, min: 0,},
  subTotal: {type: Number, required: true, min: 0,},
  taxTotal: {type: Number, required: true, min: 0,},
  currency_code: {type: String, required: true, trim: true},
  paymentMethod: {type: String, required: true, trim: true},
  status: {type: String, required: true,},
  create_time: {type: Date, default: Date.now},
  update_time: {type: Date, default: Date.now},
  shippingName: {type: String, trim: true},
  addressLine: {type: String, trim: true},
  admin_area_2: {type: String, trim: true},
  admin_area_1: {type: String, trim: true},
  postal_code: {type: String, trim: true},
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
