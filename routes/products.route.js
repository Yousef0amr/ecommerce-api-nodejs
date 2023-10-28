const express = require('express');
const productsController = require('../controllers/products.controller')
const multer = require('multer');
const router = express.Router();
const { storage, fileFilter } = require('../utils/uploadFile')


const upload = multer({ storage: storage, fileFilter })

router.route('/')
    .get(productsController.get_products)
    .post(upload.single('image'), productsController.add_product)

router.route('/:id')
    .get(productsController.get_product)
    .patch(productsController.update_product)
    .delete(productsController.delete_product)

router.route('/get/featured/:count')
    .get(productsController.get_featured_products)

router.route('/get/count')
    .get(productsController.get_count_of_products)

module.exports = router;