const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const userRoutes = require('./src/routes/user.route');
const merchantRoutes = require('./src/routes/merchant.route');
const productRoutes = require('./src/routes/product.route');


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
app.use('/api/products', productRoutes);


module.exports = app;
