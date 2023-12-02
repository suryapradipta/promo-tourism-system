const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  orderId: {type: String, required: true},
  rating: {type: Number, required: true, min: 1, max: 5},
  comment: {type: String, required: true, minlength: 5, maxLength: 500},
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
