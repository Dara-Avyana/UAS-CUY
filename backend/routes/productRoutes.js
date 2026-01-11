const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const productController = require('../controllers/productController');

router.get('/', auth, productController.getProducts);
router.post('/', auth, role('admin'), productController.createProduct);
router.delete('/:id', auth, role('admin'), productController.deleteProduct);

module.exports = router;