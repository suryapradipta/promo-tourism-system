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
}, {timestamps: true});

merchantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Merchant', merchantSchema);
