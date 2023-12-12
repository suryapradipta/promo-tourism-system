const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const mongoose = require('mongoose');
const Merchant = require('../models/merchant.model');
const { ObjectId } = require('mongoose').Types;

router.get('/product-analytics-and-stats/:merchantId', async (req, res) => {
  try {
    const merchantId = req.params.merchantId;

    if (!ObjectId.isValid(merchantId)) {
      return res.status(400).json({ error: 'Invalid merchantId' });
    }

    const productAnalytics = await Product.aggregate([
      {
        $match: { merchantId: new mongoose.Types.ObjectId(merchantId) },
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'product',
          as: 'productOrders',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalSold: { $size: '$productOrders' },
        },
      },
    ]);

    const totalProducts = productAnalytics.length;
    const totalSoldProducts = productAnalytics.reduce(
      (total, product) => total + product.totalSold,
      0
    );
    const averageSoldProducts = totalSoldProducts / totalProducts;

    const stats = {
      totalProducts,
      totalSoldProducts,
      averageSoldProducts,
    };

    res.json({ productAnalytics, stats });
  } catch (error) {
    console.error('Error while fetching analytics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/purchasing-power-analytics-and-stats/:merchantId', async (req, res) => {
    try {
      const merchantId = req.params.merchantId;

      if (!ObjectId.isValid(merchantId)) {
        return res.status(400).json({ error: 'Invalid merchantId' });
      }

      const merchantExists = await Merchant.findOne({ _id: merchantId });

      if (!merchantExists) {
        return res.status(404).json({ error: 'Merchant not found' });
      }

      const customerPurchasingPower = await Order.aggregate([
        {
          $match: { merchantId: new mongoose.Types.ObjectId(merchantId) },
        },
        {
          $group: {
            _id: '$email',
            totalSpent: { $sum: { $multiply: ['$quantity', '$totalAmount'] } },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            email: '$_id',
            totalSpent: 1,
            totalOrders: 1,
          },
        },
      ]);

      const totalCustomers = customerPurchasingPower.length;
      const totalSpent = customerPurchasingPower.reduce(
        (total, customer) => total + customer.totalSpent,
        0
      );
      const averageSpendingPerCustomer = totalSpent / totalCustomers;

      const stats = {
        totalCustomers,
        totalSpent,
        averageSpendingPerCustomer,
      };

      res.json({ customerPurchasingPower, stats });
    } catch (error) {
      console.error('Error while fetching analytics:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

router.get('/all-merchant-analytics-and-stats', async (req, res) => {
  try {
    const allMerchants = await Merchant.find({ status: 'APPROVED' });
    const allAnalyticsPromises = allMerchants.map(async (merchant) => {
      const merchantId = merchant._id;

      const productAnalytics = await Product.aggregate([
        { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'product',
            as: 'productOrders',
          },
        },
        {
          $group: {
            _id: null,
            totalSold: { $sum: { $size: '$productOrders' } },
          },
        },
        {
          $project: {
            _id: 0,
            totalSold: 1,
          },
        },
      ]);

      const purchasingPowerAnalytics = await Order.aggregate([
        { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: { $multiply: ['$quantity', '$totalAmount'] } },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            totalSpent: 1,
            totalOrders: 1,
          },
        },
      ]);

      return {
        merchant,
        productAnalytics: productAnalytics[0],
        purchasingPowerAnalytics: purchasingPowerAnalytics[0],
      };
    });

    const allAnalytics = await Promise.all(allAnalyticsPromises);

    const totalMerchants = allMerchants.length;
    const totalProductsSold = allAnalytics.reduce(
      (total, analytics) => total + analytics.productAnalytics.totalSold,
      0
    );
    const totalAmountSpent = allAnalytics.reduce(
      (total, analytics) =>
        total + analytics.purchasingPowerAnalytics.totalSpent,
      0
    );
    const averageProductsSold = totalProductsSold / totalMerchants;
    const averageAmountSpent = totalAmountSpent / totalMerchants;

    const stats = {
      totalMerchants,
      totalProductsSold,
      totalAmountSpent,
      averageProductsSold,
      averageAmountSpent,
    };

    res.json({ allAnalytics, stats });
  } catch (error) {
    console.error('Error while fetching analytics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
