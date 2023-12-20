const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Handles the creation of a new order.
 *
 * @route {POST} /create
 * @middleware {authMiddleware} - Ensures that the request is authenticated.
 * @param {Object} req.body - Request body containing order details.
 * @returns {Object} - JSON response indicating the success of the transaction or error details.
 * @throws {Object} - Returns a 400 status with an error message for invalid or missing input fields.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const {
      product,
      quantity,
      totalAmount,
      email,
      phoneNumber,
      customerId,
      merchantId,
    } = req.body;

    if (
      !product ||
      !quantity ||
      !totalAmount ||
      !email ||
      !phoneNumber ||
      !customerId ||
      !merchantId
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res
        .status(400)
        .json({ message: 'Quantity must be a positive integer' });
    }

    if (typeof totalAmount !== 'number' || totalAmount < 0.01) {
      return res
        .status(400)
        .json({ message: 'Total amount must be a positive number' });
    }

    const latestOrder = await Order.findOne().sort({ orderNumber: -1 });
    let orderCounter = 1;

    if (latestOrder) {
      orderCounter = parseInt(latestOrder.orderNumber.substr(7), 10) + 1;
    }

    const orderNumber = `PRS${new Date().getFullYear()}${orderCounter
      .toString()
      .padStart(5, '0')}`;

    const order = new Order({
      orderNumber,
      product,
      quantity,
      totalAmount,
      email,
      phoneNumber,
      customerId,
      merchantId,
    });

    const savedOrder = await order.save();
    res
      .status(201)
      .json({ orderId: savedOrder._id, message: 'Transaction successful!' });
  } catch (error) {
    console.error('Error submitting order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Retrieves order details by order ID.
 *
 * @route {GET} /by-id/:id
 * @middleware {authMiddleware} - Ensures that the request is authenticated.
 * @param {string} req.params.id - Unique identifier of the order to retrieve.
 * @returns {Object} - JSON response containing order details.
 * @throws {Object} - Returns a 404 status with an error message if the order is not found.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.get('/by-id/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
