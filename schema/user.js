const mongoose = require('mongoose');
const UserRegisterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobileno: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    profile:{
        type: String,
        required:false  
    },
    UserId:{
        type: String,
        required:true    
    },
    passaword:{
        type: String,
        required:false    
    }
    ,
  
});

module.exports = mongoose.model('UserRegister', UserRegisterSchema);
