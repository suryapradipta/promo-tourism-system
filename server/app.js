const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const userRoutes = require('./src/routes/user.route');
const merchantRoutes = require('./src/routes/merchant.route');
const fileRoutes = require('./src/routes/file.route');
const productRoutes = require('./src/routes/product.route');
const paymentRoutes = require('./src/routes/payment.route');
const orderRoutes = require('./src/routes/order.route');
const reviewRoutes = require('./src/routes/review.route');
const analyticsRoutes = require('./src/routes/analytics.route');
const Product = require("./src/models/product.model");


app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use('/api/users', userRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

module.exports = app;
