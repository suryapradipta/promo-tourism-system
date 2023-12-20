/**
 * Mongoose schema for representing product information.
 * @typedef {Object} Product
 * @property {string} name - The name of the product. Required and trimmed.
 * @property {string} description - The description of the product. Required with a maximum length of 500 characters.
 * @property {number} price - The price of the product. Required and must be greater than or equal to 0.
 * @property {string} image - The URL or path to the image of the product. Required.
 * @property {string} category - The category of the product. Required with predefined values.
 * @property {Array} category.enum - Possible values for the category: ['Diving', 'Cruise', 'Honeymoon', 'Homestay', 'Shopping'].
 * @property {Array} reviews - Array of review references associated with the product.
 * @property {mongoose.Types.ObjectId} reviews[] - Reference to a 'Review' document.
 * @property {mongoose.Types.ObjectId} merchantId - Reference to the 'Merchant' document representing the product's merchant. Required.
 * @property {Date} createdAt - The timestamp indicating when the product was created.
 * @property {Date} updatedAt - The timestamp indicating when the product was last updated.
 */

const mongoose = require('mongoose');

/**
 * Mongoose schema for the Product model.
 * @type {mongoose.Schema}
 */
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxLength: 500 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Diving', 'Cruise', 'Honeymoon', 'Homestay', 'Shopping'],
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
