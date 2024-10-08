
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: String,
        required: true
    },
    discount_price: {
        type: String,
        required: true
    },
    product_short_details: {
        type: String,
        required: true
    },
    product_main_details: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },

    categories: {
        type: String,
        required: true
    },
    product_brand: {
        type: String,
        required: true
    },
    dimensions: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        depth: {
            type: Number,
            required: true
        }
    },
    rating: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },

    product_weight: {
        type: Number,
        required: true
    },
    sku: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', ProductSchema);
