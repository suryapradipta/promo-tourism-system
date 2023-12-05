const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');

router.post('/create', async (req, res) => {
  try {
    const latestOrder = await Order.findOne().sort({ orderNumber: -1 });
    let orderCounter = 1;

    if (latestOrder) {
      orderCounter = parseInt(latestOrder.orderNumber.substr(7), 10) + 1;
    }

    const order = new Order({
      orderNumber: `PRS${new Date().getFullYear()}${orderCounter.toString().padStart(5, '0')}`,
      product: req.body.product,
      quantity: req.body.quantity,
      totalAmount: req.body.totalAmount,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      customerID: req.body.customerID,
      merchantID: req.body.merchantID,
    });

    const savedOrder = await order.save();
    res.status(201).json({ orderId: savedOrder._id, message: 'Transaction successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/by-id/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
