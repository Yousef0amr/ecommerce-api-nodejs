const mongoose = require('mongoose');


const categorySchema =new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    }
});



const Category =  mongoose.model('Category',categorySchema);



module.exports = Category;