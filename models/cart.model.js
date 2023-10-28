const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quentity: {
                type: Number,
                required: true
            }
        }

    ],
})


const Cart = mongoose.model('Cart', cartSchema);



module.exports = Cart