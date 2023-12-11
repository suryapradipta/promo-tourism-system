const express = require('express');
const router = express.Router();
const Review = require('../models/review.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

router.get('/unreviewed-orders/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    if (
      !customerId ||
      !mongoose.Types.ObjectId.isValid(customerId) ||
      customerId.trim() === ''
    ) {
      return res.status(400).json({ message: 'Invalid customerId parameter' });
    }

    const reviewedOrderIds = await Review.find({}).distinct('orderId');

    const unreviewedOrders = await Order.find({
      customerId: customerId,
      _id: { $nin: reviewedOrderIds },
    }).populate('product', 'name description price image category');

    res.status(200).json(unreviewedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/submit-review', async (req, res) => {
  try {
    const { orderId, rating, comment, userId } = req.body;

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
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
