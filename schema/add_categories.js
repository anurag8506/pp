
const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    categoriesId: {
        type: String,
        required: true
    },
    categories_name: {
        type: String,
        required: true
    },
    categories_img: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model('Categories', CategoriesSchema);
