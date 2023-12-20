const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const Payment = require('../models/payment.model');
const authMiddleware = require('../middleware/auth.middleware');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

/**
 * Creates a PayPal transaction for a given product and processes the payment.
 *
 * @route {POST} /create-paypal-transaction
 * @param {Object} req.body - Request body containing product details for the PayPal transaction.
 * @returns {Object} - JSON response containing the PayPal transaction ID.
 * @throws {Object} - Returns a 400 status with an error message for missing required fields.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.post('/create-paypal-transaction', async (req, res) => {
  try {
    const { product, itemTotal, itemTotalValue, taxTotalValue, quantity } =
      req.body;

    if (
      !product ||
      !itemTotal ||
      !itemTotalValue ||
      !taxTotalValue ||
      !quantity
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
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
                value: itemTotalValue,
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
    console.error('Error during payment:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Saves payment details to the database after a successful PayPal transaction.
 *
 * @route {POST} /save-payment
 * @middleware {authMiddleware} - Requires authentication to save payment details.
 * @param {Object} req.body - Request body containing payment details to be saved.
 * @returns {Object} - JSON response containing the saved payment details.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.post('/save-payment', authMiddleware, async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Retrieves payment details by PayPal transaction ID.
 *
 * @route {GET} /get-by-paypal-id/:paypalId
 * @middleware {authMiddleware} - Requires authentication to fetch payment details.
 * @param {string} req.params.paypalId - PayPal transaction ID for the payment to be retrieved.
 * @returns {Object} - JSON response containing the payment details.
 * @throws {Object} - Returns a 400 status with an error message for an invalid PayPal transaction ID.
 * @throws {Object} - Returns a 404 status with an error message if the payment is not found.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.get('/get-by-paypal-id/:paypalId', authMiddleware, async (req, res) => {
  try {
    const paypalId = req.params.paypalId;

    if (typeof paypalId !== 'string' || paypalId.trim() === '') {
      return res.status(400).json({ message: 'Invalid paypalId parameter' });
    }

    const payment = await Payment.findOne({ paypalId: paypalId }).populate(
      'orderId'
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
