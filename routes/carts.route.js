const express = require('express');
const cartsController = require('../controllers/carts.controller')
const router = express.Router();
const scanProduct = require('../middlewares/scanProduct')


router.route('/')
    .get(cartsController.get_cart)
    .post(scanProduct, cartsController.add_to_cart)
    .delete(scanProduct, cartsController.remove_from_cart)
    .patch(scanProduct, cartsController.update_cart)

router.route('/clear_cart')
    .delete(cartsController.clear_cart)



module.exports = router