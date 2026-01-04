const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { addProduct, editProduct, deleteProduct, importCSV, getOrders, updateOrderStatus } = require('../controllers/adminController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.use(auth, admin);

router.post('/products', upload.array('images'), addProduct);
router.put('/products/:id', editProduct);
router.delete('/products/:id', deleteProduct);
router.post('/import-csv', upload.single('csv'), importCSV);
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrderStatus);

module.exports = router;
