const Product = require('../models/product.model');
const authMiddleware = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;


const projectRoot = path.resolve(__dirname, '..');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(projectRoot, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});
const upload = multer({ storage: storage });
const uploadDirectory = path.join(__dirname, '..', 'uploads');

router.post('/add-product', authMiddleware, upload.single('image'),
  async (req, res) => {
  try {
    const { name, description, price, category, merchantId } = req.body;
    const image = req.file.filename;

    const newProduct = new Product({ name, description, price, image, category, merchantId });
    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/edit-product/:id', upload.single('image'), async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, category } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;

    // Handle image update
    if (req.file) {
      // Remove the existing image file if it exists
      if (product.image) {
        const filePath = path.join(uploadDirectory, product.image);
        await fs.unlink(filePath);
      }

      product.image = req.file.filename;
    }

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/delete-product/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Remove the associated image file if it exists
    if (product.image) {
      const filePath = path.join(uploadDirectory, product.image);
      await fs.unlink(filePath);
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/find/merchantId/:merchantId', async (req, res) => {
  const merchantId = req.params.merchantId;

  try {
    const products = await Product.find({ merchantId: merchantId });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/find/id/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
