const asyncWrapper = require("../middlewares/asyncWrapper");
const Cart = require("../models/cart.model");
const httpStatus = require("../utils/httpStatusText");
const appError = require("../utils/errorHandler");
const statusCodes = require("../utils/statusCodeText");


const dropData = { __v: false, _id: false, userId: false };

const get_cart = asyncWrapper(
    async (req, res, next) => {
        const userId = req.userId

        const cart = await Cart.find({ userId: userId }, { ...dropData })
        if (!cart) {
            const error = appError.create(statusCodes[404], 404, httpStatus.FAIL);
            return next(error);
        }
        return res
            .status(200)
            .json({ status: httpStatus.SUCCESS, data: { cart } });
    }
)

const add_to_cart = asyncWrapper(
    async (req, res, next) => {
        const productdata = req.body
        const userId = req.userId

        await Cart
            .findOneAndUpdate({ userId: userId, "cartItems.product": { $ne: productdata.product } },
                { $push: { cartItems: { ...productdata } } }, { new: true, ...dropData })
            .populate('cartItems.product').then(cart => {
                if (cart) {
                    res.status(200).json({ status: httpStatus.SUCCESS, data: { cart } })
                } else {
                    const error = appError.create("The product already exists you couldn't add more than one time in cart", 400, httpStatus.FAIL);
                    return next(error);
                }
            })
    }
)

const update_cart = asyncWrapper(
    async (req, res, next) => {
        const productdata = req.body
        const userId = req.userId
        const productId = req.query.productId

        await Cart
            .findOneAndUpdate({
                userId: userId,
                "cartItems.product": productId
            }, { $set: { "cartItems.$.quentity": productdata.quentity } }, { new: true, ...dropData })
            .populate('cartItems.product').then(cart => {
                if (cart) {
                    res.status(200).json({ status: httpStatus.SUCCESS, data: { cart } })
                } else {
                    const error = appError.create("The product doesn't exist in cart", 400, httpStatus.FAIL);
                    return next(error);
                }
            })
    }
)



const remove_from_cart = asyncWrapper(
    async (req, res, next) => {
        const userId = req.userId
        const productId = req.query.product

        await Cart
            .findOneAndUpdate({ userId: userId }, { $pull: { cartItems: { product: productId } } }, { new: true, ...dropData })
            .populate('cartItems.product').then(cart => {
                if (cart) {
                    res.status(200).json({ status: httpStatus.SUCCESS, data: { cart } })
                } else {
                    const error = appError.create("The product doesn't exist in cart", 400, httpStatus.FAIL);
                    return next(error);
                }
            })

    }
)


const clear_cart = asyncWrapper(
    async (req, res, next) => {
        const userId = req.userId

        await Cart
            .findOneAndUpdate({ userId: userId }, { $set: { cartItems: [] } }).then(cart => {
                if (cart) {
                    res.status(200).json({ status: httpStatus.SUCCESS, data: null })
                } else {
                    const error = appError.create("cart is already empty", 400, httpStatus.FAIL);
                    return next(error);
                }
            })

    }
)







module.exports = {
    get_cart,
    add_to_cart,
    remove_from_cart,
    update_cart,
    clear_cart
}