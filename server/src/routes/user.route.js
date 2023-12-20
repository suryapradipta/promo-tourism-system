const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

/**
 * Handles user registration, storing user information securely in the database.
 *
 * @route {POST} /register
 * @param {Object} req.body - The request body containing email, password, role, and isFirstLogin.
 * @returns {Object} - JSON response indicating the success of user registration.
 * @throws {Object} - Returns a 400 status with an error message for missing or invalid fields.
 * @throws {Object} - Returns a 409 status with an error message if the email is already registered.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.post('/register', async (req, res) => {
  const { email, password, role, isFirstLogin } = req.body;

  if (!email || !password || !role || isFirstLogin === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 8 characters long' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email is already registered' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role,
      isFirstLogin,
    });

    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Handles user login, validating credentials and generating a JWT token upon successful authentication.
 *
 * @route {POST} /login
 * @param {Object} req.body - The request body containing email and password.
 * @returns {Object} - JSON response containing a JWT token upon successful login.
 * @throws {Object} - Returns a 400 status with an error message for invalid or missing fields.
 * @throws {Object} - Returns a 401 status with an error message for invalid email or password.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = {
      email: user.email,
      _id: user._id,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Server error');
  }
});

/**
 * Retrieves the current user based on the provided JWT token.
 *
 * @route {GET} /current-user
 * @middleware {authMiddleware} - Ensures that the request is authenticated.
 * @returns {Object} - JSON response containing details of the current user.
 * @throws {Object} - Returns a 401 status with an error message if authentication fails.
 */
router.get('/current-user', authMiddleware, (req, res) => {
  res.json(req.user);
});

/**
 * Checks if a user's first login status based on their email.
 *
 * @route {GET} /is-first-login/:email
 * @middleware {authMiddleware} - Ensures that the request is authenticated.
 * @param {string} email - The email address of the user.
 * @returns {Object} - JSON response indicating whether it's the user's first login.
 * @throws {Object} - Returns a 400 status with an error message if the email is missing.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.get('/is-first-login/:email', authMiddleware, async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    const isFirstLogin = user && user.isFirstLogin;
    res.json(isFirstLogin);
  } catch (error) {
    console.error('Error checking first login:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * Updates the user's password based on their email.
 *
 * @route {POST} /update-password
 * @middleware {authMiddleware} - Ensures that the request is authenticated.
 * @param {Object} req.body - The request body containing email and newPassword.
 * @returns {Object} - JSON response indicating the success of the password update.
 * @throws {Object} - Returns a 400 status with an error message if email or newPassword is missing.
 * @throws {Object} - Returns a 404 status with an error message if the user is not found.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.post('/update-password', authMiddleware, async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ error: 'Email and new password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword, isFirstLogin: false },
      { new: true }
    );
    res.status(201).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Checks the validity of a user's current password.
 *
 * @route {POST} /check-password
 * @middleware {authMiddleware} - Ensures that the request is authenticated.
 * @param {Object} req.body - The request body containing email and currentPassword.
 * @returns {Object} - JSON response indicating whether the current password is valid.
 * @throws {Object} - Returns a 400 status with an error message if email or currentPassword is missing.
 * @throws {Object} - Returns a 404 status with an error message if the user is not found.
 * @throws {Object} - Returns a 500 status with an error message for internal server errors.
 */
router.post('/check-password', authMiddleware, async (req, res) => {
  const { email, currentPassword } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = user
      ? await bcrypt.compare(currentPassword, user.password)
      : false;

    res.json(isValid);
  } catch (error) {
    console.error('Error checking password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
