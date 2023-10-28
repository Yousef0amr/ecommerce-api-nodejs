const express = require('express');
const ordersController = require('../controllers/orders.controller')

const router = express.Router();


router.route('/')
    .get(ordersController.get_orders)
    .post(ordersController.add_order);


router.route('/get_orders')
    .get(ordersController.get_order)

router.route('/:id')
    .put(ordersController.update_order)
    .delete(ordersController.delete_order);


router.route('/get/count')
    .get(ordersController.get_orders_count)

router.route('/get/total_sales')
    .get(ordersController.get_total_sales)
module.exports = router;

