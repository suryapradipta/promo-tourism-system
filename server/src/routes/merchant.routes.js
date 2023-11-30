const multer = require('multer');
const express = require('express');
const Merchant = require('../models/merchant');
const User = require('../models/user');


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/register-merchant', async (req, res) => {
  try {
    const {
      name,
      contact_number,
      email,
      company_description,
    } = req.body;

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

    const files = req.files.map((file) => ({
      filename: file.originalname,
      content: file.buffer.toString('base64'),
    }));

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

router.get('/pending', async (req, res) => {
  try {
    const pendingMerchants = await Merchant.find({ status: 'PENDING' });
    res.json(pendingMerchants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  const merchantId = req.params.id;

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

router.put('/approve/:id', async (req, res) => {
  const merchantId = req.params.id;

  try {
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    merchant.status = 'APPROVED';
    await merchant.save();

    //  may choose to create a user account here

    return res.status(200).json({ message: 'Merchant approved successfully', merchant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/reject/:id', async (req, res) => {
  const merchantId = req.params.id;

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

module.exports = router;
