const asyncWrapper = require("./asyncWrapper");
const Product = require("../models/product.model");
const statusCodes = require("../utils/statusCodeText");
const httpStatus = require("../utils/httpStatusText");
const appError = require("../utils/errorHandler");

const scanProduct = asyncWrapper(
    async (req, res, next) => {
        const productId = req.query.product || req.body.product
        const product = await Product.findById(productId);
        if (!product) {
            const error = appError.create(statusCodes[404], 404, httpStatus.FAIL);
            return next(error);
        }
        return next();
    }
)



module.exports = scanProduct









