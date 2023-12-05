const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  merchantID: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
});

orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Order', orderSchema);
