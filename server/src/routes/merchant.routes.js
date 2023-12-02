const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const nodemailer = require('nodemailer');

const Merchant = require('../models/merchant');
const User = require('../models/user');
const authMiddleware = require("../middleware/auth.middleware");
const mongoose = require("mongoose");


const router = express.Router();
const projectRoot = path.resolve(__dirname, '..');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(projectRoot, 'uploads')); // Define the destination directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
});
const uploadDirectory = path.join(__dirname, '..', 'uploads');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

router.post('/register-merchant', async (req, res) => {
  try {
    const {
      name,
      contact_number,
      email,
      company_description,
    } = req.body;

    if (!name || !contact_number || !email || !company_description) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const merchant = new Merchant({
      name,
      contact_number,
      email,
      company_description,
    });

    await merchant.save().then(registeredMerchant => {
      console.log(registeredMerchant);
      res.status(201).json({
        message: 'Merchant registered successfully',
        id: registeredMerchant._id
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  }
});

router.post('/:id/upload', upload.array('documents'), async (req, res) => {
  try {
    const merchantId = req.params.id;
    const documentDescription = req.body.document_description;

    if (!documentDescription) {
      return res.status(400).json({ message: 'Document description is required' });
    }

    const files = req.files.map((file) => ({
      filename: file.filename, // Use the filename provided by multer
    }));

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'At least one document is required' });
    }
    for (const file of files) {
      if (file.size > 1024 * 1024) {
        // Limit file size to 1MB
        return res.status(400).json({ message: 'File size exceeds the limit (1MB)' });
      }
    }

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({message: 'Merchant not found'});
    }

    merchant.documents = files;
    merchant.document_description = documentDescription;

    await merchant.save();
    res.status(200).json({message: 'Documents uploaded successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  }
});

router.get('/server/src/uploads/:filename',(req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDirectory, filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
});

router.get('/pending', authMiddleware,async (req, res) => {
  try {
    // Parse query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default limit is 10

    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;
    const pendingMerchants = await Merchant.find({ status: 'PENDING' })
      .skip(skip)
      .limit(limit);

    res.json(pendingMerchants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', authMiddleware,async (req, res) => {
  const merchantId = req.params.id;

  // Validate that merchantId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(merchantId)) {
    return res.status(400).json({ message: 'Invalid merchant ID' });
  }

  try {
    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    res.status(200).json(merchant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/approve/:id', authMiddleware,async (req, res) => {
  const merchantId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(merchantId)) {
    return res.status(400).json({ message: 'Invalid merchant ID' });
  }

  try {
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    merchant.status = 'APPROVED';
    await merchant.save();

    return res.status(200).json({ message: 'Merchant approved successfully', merchant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/reject/:id', authMiddleware,async (req, res) => {
  const merchantId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(merchantId)) {
    return res.status(400).json({ message: 'Invalid merchant ID' });
  }

  try {
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    merchant.status = 'REJECTED';
    await merchant.save();

    return res.status(200).json({ message: 'Merchant rejected successfully', merchant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/send-email',authMiddleware, async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email Sent' });
    }
  });
});

router.get('', async (req, res) => {
  try {
    const merchants = await Merchant.find();
    res.json(merchants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    const merchant = await Merchant.findOne({ email }, '_id');
    if (merchant) {
      res.json({ merchantId: merchant._id });
    } else {
      res.status(404).json({ message: 'Merchant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
