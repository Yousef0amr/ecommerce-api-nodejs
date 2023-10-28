const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    orderItems: {
        type: [],
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
});



const Order = mongoose.model('Order', orderSchema);



module.exports = Order;