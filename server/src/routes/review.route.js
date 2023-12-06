const express = require('express');
const router = express.Router();
const Review = require('../models/review.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

router.get('/unreviewed-orders/:customerId', async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const reviewedOrderIds = (await Review.find({}).select('orderId')).map((review) => review.orderId);

    // Retrieve unreviewed orders for the specified customer
    const unreviewedOrders = await Order.find({ customerId: customerId, _id: { $nin: reviewedOrderIds } })
      .populate('product', 'name description price image category');

    res.status(200).json(unreviewedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/submit-review', async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    // Save the review
    const review = new Review({ orderId, rating, comment });
    await review.save();

    // Update the product with the new review
    const order = await Order.findById(orderId);
    const product = await Product.findById(order.product);

    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
