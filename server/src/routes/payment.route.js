const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

router.post('/create-paypal-transaction', async (req, res) => {
  try {
    const { product, itemTotal, itemTotalValue, taxTotalValue, quantity } = req.body;

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


module.exports = router;
