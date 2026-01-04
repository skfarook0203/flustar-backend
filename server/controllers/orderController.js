const Order = require('../models/Order');

// Create order
exports.createOrder = async (req, res) => {
  const { products, totalAmount, address, paymentMethod } = req.body;
  try {
    const order = new Order({ user: req.user.id, products, totalAmount, address, paymentMethod });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
