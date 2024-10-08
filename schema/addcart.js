
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true,
        min: ['1', 'Quantity can not be less then 1.']
    },
    date:{
        type: Date,
        default: () => new Date(Date.now())
    }
});

module.exports = mongoose.model('Cart', CartSchema);
