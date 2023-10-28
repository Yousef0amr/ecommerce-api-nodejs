const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const appError = require("../utils/errorHandler");
const httpStatus = require('../utils/httpStatusText')
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken')
const Cart = require('../models/cart.model')

const register = asyncWrapper(
    async (req, res, next) => {
        const newUser = new User({
            ...req.body
        })
        newUser.password = await bcrypt.hash(newUser.password, 10);
        const user = await newUser.save();

        if (user) {
            const cart = new Cart({
                userId: user._id
            })
            await cart.save();
        }
        const token = generateToken({
            email: user.email,
            userId: user._id,
            isAdmin: user.isAdmin
        })
        return res.status(201).json({ status: httpStatus.SUCCESS, data: { token } })
    }
)

const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body;
        if (!email && !password || !email || !password) {
            let error = appError.create("email or password not correct", 400, httpStatus.FAIL)
            return next(error);
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = appError.create("User not found", 404, httpStatus.FAIL)
            return next(error)
        }
        const isValid = await bcrypt.compare(req.body.password, user.password)
        if (user && isValid) {
            const token = generateToken({
                email: user.email,
                userId: user._id,
                isAdmin: user.isAdmin
            })
            return res.status(200).json({ status: httpStatus.SUCCESS, data: { token } })
        } else {
            const error = appError.create("Invalid password ", 400, httpStatus.FAIL)
            return next(error)
        }
    }
)

module.exports = {
    register,
    login
}