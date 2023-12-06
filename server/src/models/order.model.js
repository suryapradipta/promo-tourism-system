const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1},
  totalAmount: { type: Number, required: true, min: 0},
  email: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
}, {timestamps: true});

orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Order', orderSchema);
