const fs = require('fs');
const path = require('path');
const formidable = require("formidable");
const validator = require("./validator.js");
const axios = require('axios');


const Cart=require("../schema/addcart.js")
const UserRegister=require("../schema/user.js")

module.exports = {
    user_details: async (req, fields, files, res) => {
        console.log(res)
        try {
            var requiredFields = ["name",  "email", "mobileno"];
            var validation = validator.check_required_fields(fields, requiredFields);
            if (!validation.status) {
                res.status(400).json({
                    status: false,
                    message: 'Validation failed. Please fill '+requiredFields[validation.key],
                    key: validation.key
                });
                return;
            }
            var name = fields.name.toString();
      
            var email = fields.email.toString();
            var mobileno = fields.mobileno.toString();

            var userId = req.session && req.session.userId ? req.session.userId : null;
        
            if (req.session && req.user && req.user.id) { 
                req.session.userId = req.user.id; 
                userId = req.user.id;
            }

            let user = await UserRegister.findOne({ email: email });

            if (user) {
       
                user.name =  name;
              
                user.phone = phone;
                req.session.userId = user.userId;
                await user.save();
            } else {
              
                user = new UserRegister({
                    name: name,
                 
                    email: email,
                    mobileno:mobileno,
                    userId: userId
                });
                await user.save();
            }

            await UserOrder.updateMany({ userId: req.session.userId }, { userId: user.userId });
            await Cart.updateMany({ userId: req.session.userId }, { userId: user.userId });
            console.log("Updated Cart userId: ", user.userId);
       
            req.session.userId = user.userId;
            console.log("updated-session", user.userId, req.session.userId);
            return {
                status: true,
                message: 'User details successfully created/updated in all tables!',              
                userId: req.session.userId
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: 'An error occurred while creating/updating the user details..',
                error: error.message  ,          
                userId: req.session.userId
            };
        }
    }
}
