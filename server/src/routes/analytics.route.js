const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");
const Merchant = require("../models/merchant.model");

router.get("/product-analytics/:merchantId", async (req, res) => {
  try {
    const merchantId = req.params.merchantId;

    const productAnalytics = await Product.aggregate([{$match: {merchantId: new mongoose.Types.ObjectId(merchantId)}}, {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "product",
        as: "productOrders",
      },
    }, {
      $project: {
        _id: 1, name: 1, totalSold: {$size: "$productOrders"},
      },
    },]);

    res.json(productAnalytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

router.get("/purchasing-power-analytics/:merchantId", async (req, res) => {
  try {
    const merchantId = req.params.merchantId;

    const customerPurchasingPower = await Order.aggregate([{$match: {merchantId: new mongoose.Types.ObjectId(merchantId)}}, {
      $group: {
        _id: "$email",
        totalSpent: {$sum: {$multiply: ["$quantity", "$totalAmount"]}},
        totalOrders: {$sum: 1},
      },
    }, {
      $project: {
        _id: 0, email: "$_id", totalSpent: 1, totalOrders: 1,
      },
    },]);

    res.json(customerPurchasingPower);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

/*router.get("/all-merchant-analytics", async (req, res) => {
  try {
    const allMerchants = await Merchant.find();
    const allAnalyticsPromises = allMerchants.map(async (merchant) => {
      const merchantId = merchant._id;
      const productAnalytics = await Product.aggregate([{$match: {merchantId: new mongoose.Types.ObjectId(merchantId)}}, {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "product",
          as: "productOrders",
        },
      }, {
        $project: {
          _id: 1, name: 1, totalSold: {$sum: '$productOrders.quantity'},
        },
      },]);

      const purchasingPowerAnalytics = await Order.aggregate([{$match: {merchantId: new mongoose.Types.ObjectId(merchantId)}}, {
        $group: {
          _id: "$email",
          totalSpent: {$sum: {$multiply: ["$quantity", "$totalAmount"]}},
          totalOrders: {$sum: 1},
        },
      }, {
        $project: {
          _id: 0, email: "$_id", totalSpent: 1, totalOrders: 1,
        },
      },]);

      return {
        merchant, productAnalytics, purchasingPowerAnalytics,
      };
    });

    const allAnalytics = await Promise.all(allAnalyticsPromises);
    res.json(allAnalytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Internal Server Error"});
  }
});*/

/*router.get('/all-merchant-analytics', async (req, res) => {
  try {
    const allMerchants = await Merchant.find();
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
          $project: {
            _id: 1,
            name: 1,
            totalSold: { $sum: '$productOrders.quantity' }, // Sum of total sold
          },
        },
      ]);

      const purchasingPowerAnalytics = await Order.aggregate([
        { $match: { merchantId: new mongoose.Types.ObjectId(merchantId) } },
        {
          $group: {
            _id: '$email',
            totalSpent: { $sum: { $multiply: ['$quantity', '$totalAmount'] } },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: '$totalSpent' }, // Sum of total spent
          },
        },
        {
          $project: {
            _id: 0,
            totalSpent: 1,
          },
        },
      ]);

      const [productAnalyticsResult] = productAnalytics;
      const [purchasingPowerAnalyticsResult] = purchasingPowerAnalytics;

      return {
        merchant,
        productAnalytics: productAnalyticsResult ? productAnalyticsResult.totalSold : 0,
        purchasingPowerAnalytics: purchasingPowerAnalyticsResult
          ? purchasingPowerAnalyticsResult.totalSpent
          : 0,
      };
    });

    const allAnalytics = await Promise.all(allAnalyticsPromises);
    console.log(allAnalytics)
    res.json(allAnalytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});*/

// Update your existing routes file

router.get('/all-merchant-analytics', async (req, res) => {
  try {
    const allMerchants = await Merchant.find(); // Update with your Merchant model
    const allAnalyticsPromises = allMerchants.map(async (merchant) => {
      const merchantId = merchant._id; // Ensure merchantId is defined here

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
            _id: null, // Group all documents into a single group
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
            _id: null, // Group all documents into a single group
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
        productAnalytics: productAnalytics[0], // Assuming only one result for each merchant
        purchasingPowerAnalytics: purchasingPowerAnalytics[0], // Assuming only one result for each merchant
      };
    });

    const allAnalytics = await Promise.all(allAnalyticsPromises);
    res.json(allAnalytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
