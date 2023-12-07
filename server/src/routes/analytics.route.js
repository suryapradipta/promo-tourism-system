const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");
const Merchant = require("../models/merchant.model");

router.get("/product-analytics/:merchantId", async (req, res) => {
  try {
    const merchantId = req.params.merchantId;

    /*const products = await Product.find({ merchantId });
    const orders = await Order.find({ merchantId }).populate('product');

    const productAnalytics = products.map((product) => {
      const productOrders = orders.filter(
        (order) => order.product._id.toString() === product._id.toString()
      );
      return {
        product: product.toObject(),
        totalSold: productOrders.length,
      };
    });*/
    const productAnalytics = await Product.aggregate([
      { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "product",
          as: "productOrders",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalSold: { $size: "$productOrders" },
        },
      },
    ]);
    // console.log(productAnalytics)

    res.json(productAnalytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/purchasing-power-analytics/:merchantId", async (req, res) => {
  try {
    const merchantId = req.params.merchantId;

    /*const orders = await Order.find({ merchantId });

    const customerPurchasingPower = orders.reduce((acc, order) => {
      const customerEmail = order.email;

      if (!acc[customerEmail]) {
        acc[customerEmail] = {
          totalSpent: 0,
          totalOrders: 0,
        };
      }

      acc[customerEmail].totalSpent += order.quantity * order.totalAmount;
      acc[customerEmail].totalOrders += 1;

      return acc;
    }, {});*/

    const customerPurchasingPower = await Order.aggregate([
      { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
      {
        $group: {
          _id: "$email",
          totalSpent: { $sum: { $multiply: ["$quantity", "$totalAmount"] } },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          email: "$_id",
          totalSpent: 1,
          totalOrders: 1,
        },
      },
    ]);

    res.json(customerPurchasingPower);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update your existing routes file

router.get("/all-merchant-analytics", async (req, res) => {
  try {
    const allMerchants = await Merchant.find();
    const allAnalyticsPromises = allMerchants.map(async (merchant) => {
      const merchantId = merchant._id;
      const productAnalytics = await Product.aggregate([
        { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "product",
            as: "productOrders",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            totalSold: { $size: "$productOrders" },
          },
        },
      ]);

      const purchasingPowerAnalytics = await Order.aggregate([
        { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
        {
          $group: {
            _id: "$email",
            totalSpent: { $sum: { $multiply: ["$quantity", "$totalAmount"] } },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            email: "$_id",
            totalSpent: 1,
            totalOrders: 1,
          },
        },
      ]);

      return {
        merchant,
        productAnalytics,
        purchasingPowerAnalytics,
      };
    });

    const allAnalytics = await Promise.all(allAnalyticsPromises);
    res.json(allAnalytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
