const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role, isFirstLogin} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role, isFirstLogin});

    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      email: user.email,
      userId: user._id,
      role: user.role,
      isFirstLogin: user.isFirstLogin
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.get('/current-user', authMiddleware, (req, res) => {
  res.json(req.user);
});

router.get('/is-first-login/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });
    const isFirstLogin = user && user.isFirstLogin;
    res.json(isFirstLogin);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/update-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword, isFirstLogin: false },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/check-password', async (req, res) => {
  const { email, currentPassword } = req.body;

  try {
    const user = await User.findOne({ email: email });
    const isValid = user
      ? await bcrypt.compare(currentPassword, user.password)
      : false;

    res.json(isValid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;