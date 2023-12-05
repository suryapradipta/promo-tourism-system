const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const Payment = require("../models/payment.model");
const authMiddleware = require("../middleware/auth.middleware");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

router.post('/create-paypal-transaction', async (req, res) => {
  try {
    const { product, itemTotal, itemTotalValue, taxTotalValue, quantity } = req.body;

    if (!product || !itemTotal || !itemTotalValue || !taxTotalValue || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: itemTotal,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: itemTotalValue
              },
              tax_total: {
                currency_code: 'USD',
                value: taxTotalValue,
              },
            },
          },
          items: [
            {
              name: product.name,
              quantity: quantity,
              unit_amount: {
                currency_code: 'USD',
                value: product.price.toFixed(2),
              },
            },
          ],
        },
      ],
    });

    const response = await client.execute(request);
    const orderID = response.result.id;
    res.json({ orderID });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/save-payment', authMiddleware, async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/get-by-paypal-id/:paypalId', authMiddleware, async (req, res) => {
  try {
    const paypalId = req.params.paypalId;

    if (typeof paypalId !== 'string' || paypalId.trim() === '') {
      return res.status(400).json({ message: 'Invalid paypalId parameter' });
    }

    const payment = await Payment.findOne({ paypalId: paypalId }).populate('orderId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
