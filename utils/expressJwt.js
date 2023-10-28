const { expressjwt } = require('express-jwt');
const verifyUserId = require('../middlewares/verifyUserId')

const secret = process.env.CRYPTO_KEY
const api = process.env.API_URL


const isRevokedCallback = async (req, token) => {
    if (verifyUserId(token)) {
        req.userId = token.payload.userId
        if (token.payload.isAdmin) {
            return false;
        } else {
            if (
                (req.method === 'GET' && req.originalUrl.includes('/api/v1/cart')) ||
                (req.method === 'POST' && req.originalUrl === '/api/v1/cart') ||
                (req.method === 'PATCH' && req.originalUrl.includes('/api/v1/cart')) ||
                (req.method === 'DELETE' && req.originalUrl.includes('/api/v1/cart')) ||
                (req.method === 'GET' && req.originalUrl.includes('/api/v1/orders/get_orders')) ||
                (req.method === 'POST' && req.originalUrl === '/api/v1/orders') ||
                (req.method === 'DELETE' && req.originalUrl.includes('/api/v1/orders'))
            ) {
                return false;
            }
        }
        // Deny access to all other routes
        return true;
    }

}


const authJwt = expressjwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevokedCallback
}).unless({
    path: [
        { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
        `${api}/users/login`,
        `${api}/users/register`,
    ]
})


module.exports = authJwt