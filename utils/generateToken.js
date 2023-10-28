const jwt = require('jsonwebtoken')

const secret = process.env.CRYPTO_KEY
const generateToken = (payload, exIn = '1d') => {
    return jwt.sign(payload, secret, { expiresIn: exIn })
}


module.exports = generateToken