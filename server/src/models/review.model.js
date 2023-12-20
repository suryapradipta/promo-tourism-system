/**
 * Mongoose schema for representing a review.
 * @typedef {Object} Review
 * @property {mongoose.Types.ObjectId} orderId - The ID of the associated order. Required.
 * @property {number} rating - The rating given in the review. Required, between 1 and 5.
 * @property {string} comment - The comment provided in the review. Required, 5 to 500 characters.
 * @property {mongoose.Types.ObjectId} userId - The ID of the user who created the review. Required.
 * @property {Date} createdAt - The timestamp indicating when the review was created.
 * @property {Date} updatedAt - The timestamp indicating when the review was last updated.
 */
const mongoose = require('mongoose');

/**
 * Mongoose schema for the Review model.
 * @type {mongoose.Schema}
 */
const reviewSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, minlength: 5, maxLength: 500 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
