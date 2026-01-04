const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createOrder, getUserOrders } = require('../controllers/orderController');

router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);

module.exports = router;
