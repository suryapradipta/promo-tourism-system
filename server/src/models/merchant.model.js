/**
 * Mongoose schema for representing merchant information.
 * @typedef {Object} Merchant
 * @property {string} name - The name of the merchant. Required and trimmed.
 * @property {number} contact_number - The contact number of the merchant. Required.
 * @property {string} email - The email of the merchant. Required, unique, lowercase, and trimmed.
 * @property {string} company_description - The description of the merchant's company. Required.
 * @property {Array} documents - Array of documents containing filename and content.
 * @property {string} documents[].filename - The filename of the document.
 * @property {string} documents[].content - The content of the document.
 * @property {string} document_description - Description of the documents.
 * @property {string} status - The status of the merchant. Required, default is 'PENDING'.
 * @property {Array} status.enum - Possible values for the status: ['PENDING', 'APPROVED', 'REJECTED'].
 * @property {Date} createdAt - The timestamp indicating when the merchant was created.
 * @property {Date} updatedAt - The timestamp indicating when the merchant was last updated.
 */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/**
 * Mongoose schema for the Merchant model.
 * @type {mongoose.Schema}
 */
const merchantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact_number: { type: Number, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    company_description: { type: String, required: true },
    documents: [
      {
        filename: String,
        content: String,
      },
    ],
    document_description: String,
    status: {
      type: String,
      required: true,
      default: 'PENDING',
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
    },
  },
  { timestamps: true }
);

merchantSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Merchant', merchantSchema);
