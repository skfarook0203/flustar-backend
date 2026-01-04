const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  images: [{ type: String }],
  isNew: { type: Boolean, default: false },
  onOffer: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
