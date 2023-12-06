const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: {type: Number, required: true, min: 1, max: 5},
  comment: {type: String, required: true, minlength: 5, maxLength: 500},
}, {timestamps: true});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
