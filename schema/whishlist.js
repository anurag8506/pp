
const mongoose = require('mongoose');

const WhishlistSchema = new mongoose.Schema({
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

    date:{
        type: Date,
        default: () => new Date(Date.now())
    }
});

module.exports = mongoose.model('Whishlist', WhishlistSchema);
