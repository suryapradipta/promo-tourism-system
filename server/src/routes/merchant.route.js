const multer = require('multer');
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');

const Merchant = require('../models/merchant.model');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth.middleware');
const mongoose = require('mongoose');

const router = express.Router();
const projectRoot = path.resolve(__dirname, '..');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(projectRoot, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 3,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      allowedMimeTypes.includes(file.mimetype) &&
      allowedExtensions.includes(ext)
    ) {
      cb(null, true);
    } else {
      const error = new Error('Invalid file type or extension');
      error.fileFilterError = true;
      cb(error);
    }
  },
});

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
    const { name, contact_number, email, company_description } = req.body;

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

    await merchant.save().then((registeredMerchant) => {
      console.log(registeredMerchant);
      res.status(201).json({
        message: 'Merchant registered successfully',
        id: registeredMerchant._id,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/:id/upload', async (req, res) => {
  const uploadArray = upload.array('documents');

  uploadArray(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(400)
          .json({ message: 'File size limit exceeded (max: 2MB)' });
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        return res
          .status(400)
          .json({ message: 'File limit exceeded (max: 3)' });
      } else {
        console.error('Multer error:', err);
        return res.status(400).json({ message: 'File upload error' });
      }
    } else if (err) {
      if (err.fileFilterError) {
        return res.status(400).json({
          message: 'Invalid file type or extension',
        });
      } else {
        console.error('Error uploading file:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
    try {
      const merchantId = req.params.id;
      const documentDescription = req.body.document_description;

      if (!documentDescription) {
        return res
          .status(400)
          .json({ message: 'Document description is required' });
      }

      const files = req.files.map((file) => ({
        filename: file.filename,
      }));

      if (!files || files.length === 0) {
        return res
          .status(400)
          .json({ message: 'At least one document is required' });
      }

      const merchant = await Merchant.findById(merchantId);
      if (!merchant) {
        return res.status(404).json({ message: 'Merchant not found' });
      }

      merchant.documents = files;
      merchant.document_description = documentDescription;

      await merchant.save();
      res.status(200).json({ message: 'Documents uploaded successfully' });
    } catch (error) {
      console.error(error);
      if (error.message === 'Invalid file type or extension') {
        return res
          .status(400)
          .json({ message: 'Invalid file type or extension' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });
});

router.get('/pending', authMiddleware, async (req, res) => {
  try {
    // Parse query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

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

router.get('/by-id/:id', authMiddleware, async (req, res) => {
  const merchantId = req.params.id;

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

router.put('/approve/:id', authMiddleware, async (req, res) => {
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

    return res
      .status(200)
      .json({ message: 'Merchant approved successfully', merchant });
  } catch (error) {
    console.error('Error approving merchant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/reject/:id', authMiddleware, async (req, res) => {
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

    return res
      .status(200)
      .json({ message: 'Merchant rejected successfully', merchant });
  } catch (error) {
    console.error('Error rejecting merchant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/send-email', authMiddleware, async (req, res) => {
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
      console.error('Error sending email:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email Sent' });
    }
  });
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const merchants = await Merchant.find();
    res.json(merchants);
  } catch (error) {
    console.error('Error fetching merchant:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/by-email/:email', authMiddleware, async (req, res) => {
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
    console.error('Error fetching merchant:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
