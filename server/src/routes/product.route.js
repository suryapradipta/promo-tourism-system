const Product = require('../models/product.model');
const authMiddleware = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');
const mongoose = require("mongoose");
const fs = require('fs').promises;

const projectRoot = path.resolve(__dirname, '..');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(projectRoot, 'uploads'));
  }, filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },});
const uploadDirectory = path.join(__dirname, '..', 'uploads');

router.post('/add-product', authMiddleware, async (req, res, err) => {
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({message: 'File size limit exceeded (max: 2MB)'});
      } else {
        console.error('Multer error:', err);
        return res.status(400).json({message: 'File upload error'});
      }
    } else if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({message: 'Internal server error'});
    }

  try {
    const {name, description, price, category, merchantId} = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const image = req.file.filename;

    if (!name || !description || !price || !category || !merchantId) {
      return res.status(400).json({message: 'All fields are required'});
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({message: 'Invalid price'});
    }

    const newProduct = new Product({
      name, description, price, image, category, merchantId
    });
    await newProduct.save();

    res.status(201).json({message: 'Product created successfully'});
  } catch (error) {
    console.error('Error submitting product:', error);
    res.status(500).json({message: 'Internal server error'});
  }
  });
});

router.put('/edit-product/:id', authMiddleware, async (req, res) => {
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({message: 'File size limit exceeded (max: 2MB)'});
      } else {
        console.error('Multer error:', err);
        return res.status(400).json({message: 'File upload error'});
      }
    } else if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({message: 'Internal server error'});
    }

  const productId = req.params.id;
  const {name, description, price, category} = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({message: 'Product not found'});
    }

    if (!name || !description || !price || !category) {
      return res.status(400).json({message: 'All fields are required'});
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;

    if (req.file) {
      // Remove the existing image file if it exists
      if (product.image) {
        const filePath = path.join(uploadDirectory, product.image);
        await fs.unlink(filePath);
      }
      product.image = req.file.filename;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      message: 'Product updated successfully', product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({message: 'Internal server error'});
  }
  });
});

router.delete('/delete-product/:id', authMiddleware, async (req, res) => {
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({message: 'Invalid product ID'});
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({message: 'Product not found'});
    }

    // Remove the associated image file if it exists
    if (product.image) {
      const filePath = path.join(uploadDirectory, product.image);
      await fs.unlink(filePath);
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({message: 'Product deleted successfully'});
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({message: 'Internal server error'});
  }
});

router.get('/by-merchant/:merchantId', authMiddleware, async (req, res) => {
  const merchantId = req.params.merchantId;

  if (!mongoose.Types.ObjectId.isValid(merchantId)) {
    return res.status(400).json({message: 'Invalid merchant ID'});
  }

  try {
    const products = await Product.find({merchantId: merchantId});

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching merchant:', error);
    res.status(500).json({message: 'Internal server error'});
  }
});

router.get('/:productId', authMiddleware, async (req, res) => {
  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({message: 'Invalid product ID'});
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({message: 'Product not found'});
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({message: 'Internal server error'});
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/average-rating/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }

    const product = await Product.findById(productId).populate('reviews');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    res.status(200).json({ averageRating });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/products/:productId/reviews', async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }
    const product = await Product.findById(productId).populate({
      path: 'reviews',
      populate: {
        path: 'userId',
        select: 'email',
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return the reviews
    res.json(product.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
