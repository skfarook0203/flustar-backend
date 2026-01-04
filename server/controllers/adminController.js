const Product = require('../models/Product');
const Order = require('../models/Order');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Add product
exports.addProduct = async (req, res) => {
  const { name, description, price, category, sizes, colors, isNew, onOffer } = req.body;
  const images = req.files ? req.files.map(file => file.filename) : [];
  try {
    const product = new Product({ name, description, price, category, sizes: sizes.split(','), colors: colors.split(','), images, isNew, onOffer });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit product
exports.editProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk import CSV
exports.importCSV = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          const existing = await Product.findOne({ name: row.name });
          if (existing) continue; // Prevent duplicates
          const price = parseFloat(row.price) * 1.24; // Increase by 24%
          const product = new Product({
            name: row.name,
            description: row.description,
            price,
            category: row.category,
            sizes: row.sizes ? row.sizes.split(',') : [],
            colors: row.colors ? row.colors.split(',') : [],
          });
          await product.save();
        }
        fs.unlinkSync(req.file.path); // Delete temp file
        res.json({ message: 'Products imported' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
};

// Get all orders for admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve/Reject order
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
