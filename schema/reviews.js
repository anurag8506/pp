const mongoose = require('mongoose');
const ReviewsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    reviews: {
        type: String,
        required: true
    },

  
});

module.exports = mongoose.model('Reviews', ReviewsSchema);
