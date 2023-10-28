const asyncWrapper = require("../middlewares/asyncWrapper");
const Category = require("../models/category.model");
const Product = require('../models/product.model');
const httpStatus = require('../utils/httpStatusText')
const appError = require('../utils/errorHandler');
const statusCodes = require("../utils/statusCodeText");
const dropData = { __v: false }

const get_products = asyncWrapper(
    async (req, res, next) => {
        let filter = {}
        if (req.query.category) {
            filter = { category: req.query.category.split(',') }
        }
        const produtcs = await Product.find(filter, { ...dropData }).populate('category', { ...dropData })
        return res.status(200).json({ status: httpStatus.SUCCESS, data: { produtcs } })
    }
)
const get_product = asyncWrapper(
    async (req, res, next) => {
        const productID = req.params.id

        const product = await Product.findById(productID, { ...dropData }).populate('category', { ...dropData });
        if (!product) {
            const error = appError.create(statusCodes[404], 404, httpStatus.FAIL)
            return next(error)
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, data: { product } })
    }
)
const add_product = asyncWrapper(
    async (req, res, next) => {
        const categoryID = req.body.category
        const isFounded = await Category.findById(categoryID)
        if (!isFounded) {
            const error = appError.create(statusCodes[404], 404, httpStatus.FAIL)
            return next(error)
        }
        const newProduct = new Product({
            ...req.body
        })
        newProduct.image = req.file.filename
        await newProduct.save();
        return res.status(200).json({ status: httpStatus.SUCCESS, data: { product: newProduct } })
    }
)
const update_product = asyncWrapper(
    async (req, res, next) => {
        const productID = req.params.id;

        await Product.findByIdAndUpdate(productID, {
            ...req.body
        }, { new: true }).then((product) => {
            if (product) {
                return res
                    .status(200)
                    .json({ status: httpStatus.SUCCESS, message: "Product has been updated", data: { product } });
            } else {
                const error = appError.create(statusCodes[404], 404, httpStatus.FAIL);
                return next(error);
            }
        });
    }
)
const delete_product = asyncWrapper(
    async (req, res, next) => {
        const productID = req.params.id
        await Product.findByIdAndRemove(productID).then(product => {
            if (product) {
                return res.status(200).json({ status: httpStatus.SUCCESS, data: null })
            } else {
                const error = appError.create(statusCodes[404], 404, httpStatus.FAIL)
                return next(error)
            }
        })
    }
)


const get_featured_products = asyncWrapper(
    async (req, res, next) => {
        const count = req.params.count || 0
        const products = await Product.find({ isFeatured: true }).limit(+count)
        if (!products) {
            const error = appError.create("There is no featured products", 404, httpStatus.FAIL)
            return next(error)
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, data: { products } })

    }
)


const get_count_of_products = asyncWrapper(
    async (req, res, next) => {
        const count = await Product.countDocuments()
        return res.status(200).json({ status: httpStatus.SUCCESS, data: { count } })
    }
)

module.exports = {
    get_products,
    get_product,
    add_product,
    update_product,
    delete_product,
    get_featured_products,
    get_count_of_products
}