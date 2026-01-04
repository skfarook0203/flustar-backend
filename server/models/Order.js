const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
  }],
  totalAmount: { type: Number, required: true },
  address: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ['COD', 'UPI'], required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Placed to supplier'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
