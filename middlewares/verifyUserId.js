const asyncWrapper = require("./asyncWrapper");
const User = require("../models/user.model");
const httpStatus = require("../utils/httpStatusText");
const appError = require("../utils/errorHandler");




const verifyUserId = async (token) => {
    const user = await User.findById(token.payload.userId)
    if (!user) {
        return false;
    }
    return true
}



module.exports = verifyUserId