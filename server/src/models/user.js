const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Remove leading and trailing whitespaces
    lowercase: true, // Convert email to lowercase
    validate: {
      validator: function (value) {
        return /\S+@\S+\.\S+/.test(value);
      },
      message: 'Invalid email address',
    },
  },
  password: {type: String, required: true,minlength: 8,},
  role: {type: String, required: true, enum: ['ministry', 'merchant', 'customer'], },
  isFirstLogin: { type: Boolean, default: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
