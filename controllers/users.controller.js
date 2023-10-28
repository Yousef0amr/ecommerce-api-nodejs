const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const appError = require("../utils/errorHandler");
const httpStatus = require('../utils/httpStatusText')
const dropData = { __v: false, password: false }



const get_users = asyncWrapper(
    async (req, res, next) => {
        const users = await User.find({}, { ...dropData })
        return res.status(200).json({ status: httpStatus.SUCCESS, data: { users } })
    }
)


const get_user = asyncWrapper(
    async (req, res, next) => {
        const userID = req.params.id;
        const user = await User.findById(userID, { ...dropData })
        if (!user) {
            const error = appError.create("User is not found", 404, httpStatus.FAIL)
            return next(error)
        }
        return res.status(200).json({ status: httpStatus.SUCCESS, data: { user } })
    }
)

const update_user = asyncWrapper(
    async (req, res, next) => {
        const userID = req.params.id;
        await User.findByIdAndUpdate(userID, { ...req.body }, { new: true }).then(user => {
            if (user) {
                return res.status(200).json({ status: httpStatus.SUCCESS, data: { user } })
            } else {
                const error = appError.create("User is not found", 404, httpStatus.FAIL)
                return next(error)
            }
        })
    }
)

const delete_user = asyncWrapper(
    async (req, res, next) => {
        const userID = req.params.id;
        await User.findByIdAndDelete(userID).then(user => {
            if (user) {
                return res.status(200).json({ status: httpStatus.SUCCESS, data: null })
            } else {
                const error = appError.create("User is not found", 404, httpStatus.FAIL)
                return next(error)
            }
        })
    }
)



module.exports = {
    get_users,
    update_user,
    delete_user,
    get_user
}