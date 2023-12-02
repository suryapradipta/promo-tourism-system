const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const merchantSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true,},
  contact_number: {type: Number, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /\S+@\S+\.\S+/.test(value);
      },
      message: 'Invalid email address',
    },
  },
  company_description: {type: String, required: true},
  documents: [{
    filename: String,
    content: String,
  }],
  document_description: String,
  status: {
    type: String, required: true, default: 'PENDING',
    enum: ['PENDING', 'APPROVED', 'REJECTED']
  },
});

merchantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Merchant', merchantSchema);
