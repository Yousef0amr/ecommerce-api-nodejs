const asyncWrapper = require('../middlewares/asyncWrapper')
const Order = require("../models/order.model")
const httpStatus = require("../utils/httpStatusText");
const appError = require("../utils/errorHandler");
const Cart = require('../models/cart.model');
const dropData = { __v: false };
const { clear_cart } = require('../controllers/carts.controller')

const get_orders = asyncWrapper(
    async (req, res, next) => {
        const orders = await Order.find({}, { ...dropData }).populate('orderItems.product').populate('user', { name: true, phone: true })
        return res
            .status(200)
            .json({ status: httpStatus.SUCCESS, data: { orders } });
    }
)

const get_order = asyncWrapper(
    async (req, res, next) => {
        const userId = req.userId
        const orders = await Order.find({ user: userId }, { ...dropData }).populate('orderItems.product')
        return res
            .status(200)
            .json({ status: httpStatus.SUCCESS, data: { orders } });
    }
)

const calc_totalPrice = (userCart) => {
    let totalPrice = 0.0
    userCart.cartItems.forEach(cartItem => {
        totalPrice += (cartItem.product.price * cartItem.quentity)
    });
    return totalPrice;
}

const add_order = asyncWrapper(
    async (req, res, next) => {
        const userId = req.userId
        const orderData = req.body
        const userCart = await Cart.findOne({ userId: userId }).populate('cartItems.product');

        const totalPrice = calc_totalPrice(userCart);

        const order = new Order({
            orderItems: userCart.cartItems,
            shippingAddress: orderData.shippingAddress,
            totalPrice: totalPrice,
            user: userId,
        })
        const done = await order.save();

        if (done) {
            await Cart.findOneAndUpdate({ userId: userId }, { $set: { cartItems: [] } });
        }

        return res
            .status(201)
            .json({ status: httpStatus.SUCCESS, data: { order } });
    }
)


const update_order = asyncWrapper(
    async (req, res, next) => {
        const orderId = req.params.id
        const order = await Order.findByIdAndUpdate(orderId, {
            status: req.body.status
        }, { new: true, ...dropData }).then(order => {
            if (order) {
                res.status(200).json({ status: httpStatus.SUCCESS, data: { order } })
            } else {
                const error = appError.create("order doesn't exit", 400, httpStatus.FAIL);
                return next(error);
            }
        })

        return res
            .status(200)
            .json({ status: httpStatus.SUCCESS, data: { order } });
    }
)


const delete_order = asyncWrapper(
    async (req, res, next) => {
        const orderId = req.params.id
        await Order
            .findByIdAndDelete(orderId)
            .then(order => {
                if (order) {
                    res.status(200).json({ status: httpStatus.SUCCESS, data: null })
                } else {
                    const error = appError.create('someThing wrong', 400, httpStatus.FAIL);
                    return next(error);
                }
            })
    }
)

const get_orders_count = asyncWrapper(
    async (req, res, next) => {
        const count = await Order.countDocuments()
        return res.status(200).json({ status: httpStatus.SUCCESS, data: { count } })
    }
)


const get_total_sales = asyncWrapper(
    async (req, res, next) => {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" }
                }
            }
        ]);

        const totalSales = orders.length > 0 ? orders[0].totalSales : 0;
        return res.status(200).json({ status: httpStatus.SUCCESS, data: { totalSales } })
    }
);




module.exports = {
    get_orders,
    add_order,
    get_order,
    update_order,
    delete_order,
    get_orders_count,
    get_total_sales
}