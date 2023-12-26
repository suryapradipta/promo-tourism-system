/**
 * Mongoose schema for representing user information.
 * @typedef {Object} User
 * @property {string} email - The email of the user. Required, unique, lowercase, and trimmed.
 * @property {string} password - The password of the user. Required, with a minimum length of 8 characters.
 * @property {string} role - The role of the user. Required and must be one of ['ministry', 'merchant', 'customer'].
 * @property {boolean} isFirstLogin - Flag indicating if it is the user's first login. Default is false.
 * @property {string} timestamps - Automatic timestamps for the schema.
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Mongoose schema for the User model.
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      required: true,
      enum: ['ministry', 'merchant', 'customer'],
    },
    isFirstLogin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
