const express = require('express');
const router = express.Router();
const Review = require('../models/review.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Retrieves unreviewed orders for a specific customer based on their ID.
 *
 * @route {GET} /unreviewed-orders/:customerId
 * @middleware {authMiddleware} - Ensures that the request is authenticated.
 * @param {string} customerId - The unique identifier of the customer.
 * @returns {Object} - JSON response containing unreviewed orders with product details.
 * @throws {Object} - Returns a 400 status with an error message for an invalid customerId parameter.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.get(
  '/unreviewed-orders/:customerId',
  authMiddleware,
  async (req, res) => {
    try {
      const { customerId } = req.params;

      if (
        !customerId ||
        !mongoose.Types.ObjectId.isValid(customerId) ||
        customerId.trim() === ''
      ) {
        return res
          .status(400)
          .json({ message: 'Invalid customerId parameter' });
      }

      const reviewedOrderIds = await Review.find({}).distinct('orderId');

      const unreviewedOrders = await Order.find({
        customerId: customerId,
        _id: { $nin: reviewedOrderIds },
      }).populate('product', 'name description price image category');

      res.status(200).json(unreviewedOrders);
    } catch (error) {
      console.error('Error fetching unreviewed orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

/**
 * Submits a review for a specific order, including a rating and optional comment.
 *
 * @route {POST} /submit-review
 * @middleware {authMiddleware} - Ensures that the request is authenticated.
 * @param {Object} req.body - The request body containing orderId, rating, comment, and userId.
 * @returns {Object} - JSON response indicating the success of the review submission.
 * @throws {Object} - Returns a 400 status with an error message if any required fields are missing or invalid.
 * @throws {Object} - Returns a 404 status with an error message if the order or product is not found.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.post('/submit-review', authMiddleware, async (req, res) => {
  try {
    const { orderId, rating, comment, userId } = req.body;

    if (!orderId || !rating || !comment || !userId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: 'Rating must be a number between 1 and 5' });
    }

    const review = new Review({ orderId, rating, comment, userId });
    await review.save();

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const product = await Product.findById(order.product);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
