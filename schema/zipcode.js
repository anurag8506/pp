const mongoose = require('mongoose');

const ZipcodeSchema = new mongoose.Schema({
    _id: {
        $oid: {
            type: String,
            required: true,
            unique: true
        }
    },
    country_code: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    state_code: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    province_code: {
        type: String,
        required: true
    },
    community: {
        type: String,
        required: true
    },
    community_code: {
        type: String
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Zipcode', ZipcodeSchema);
