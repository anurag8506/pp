const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserOrderSchema = new Schema({
    orderId: String,
    address: String,
    zipcode: String,
    town: String,
    state: String,
    products: [{
        productName: String,
        productPrice: Number,
        productQuantity: Number,
        productId: String,
        image: String
    }],
    shippingOption: String,
    paymentMethod: String,
    name: String,
    email: String,
    mobileno: String,
    userId: String,
    grandTotal: String,
    paymentstatus: { type: String, default: 'unpaid' },
    transactionId: { type: String, default: null },
    razorpay_orderid: { type: String, default: null },
    paymentDate: { type: Date, default: null }
});

module.exports = mongoose.model('UserOrder', UserOrderSchema);
