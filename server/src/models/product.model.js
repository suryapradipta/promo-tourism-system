const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true,},
  description: {type: String, required: true, maxLength: 500},
  price: {type: Number, required: true, min:0},
  image: {type: String, required: true},
  category: {
    type: String, required: true,
    enum: ['Diving', 'Cruise', 'Honeymoon', 'Homestay', 'Shopping'],
  },
  reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
  merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
}, {timestamps: true});


module.exports = mongoose.model('Product', productSchema);
