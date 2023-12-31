/**
 * Express application configuration for managing various routes and connecting to MongoDB.
 * @module app
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

// Importing route handlers for different functionalities
const userRoutes = require('./src/routes/user.route');
const merchantRoutes = require('./src/routes/merchant.route');
const fileRoutes = require('./src/routes/file.route');
const productRoutes = require('./src/routes/product.route');
const paymentRoutes = require('./src/routes/payment.route');
const orderRoutes = require('./src/routes/order.route');
const reviewRoutes = require('./src/routes/review.route');
const analyticsRoutes = require('./src/routes/analytics.route');

// Setting up middleware for parsing JSON data and handling Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json());
app.use(cors());

/**
 * Connect to the MongoDB database using Mongoose.
 * @returns {Promise<void>} A Promise that resolves when the connection is successful.
 * @throws {Error} Throws an error if the connection fails.
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed');
  });

// Routing for different API endpoints
app.use('/api/users', userRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

module.exports = app;
