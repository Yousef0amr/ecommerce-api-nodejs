const mongoose = require('mongoose');
const validator = require('validator');
const Product = require('./product.model');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "invalid email address"],
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    }
});



// userSchema.virtual('id').get(() => {
//     return this._id.toHexString()
// })

// userSchema.set('toJSON',{
//     virtuals: true
// })


const User = mongoose.model('User', userSchema);



module.exports = User;