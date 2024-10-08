const express = require('express');
const formidable = require('formidable');
const Whishlist= require("../schema/whishlist.js");
const validator = require('./validator.js');
const fs = require('fs');

module.exports = {
    addwhishlist_form: async (req, fields, files, res) => {
        try {
            const requiredFields = ["product_name", "productId"];

            const validation = validator.check_required_fields(fields, requiredFields);

            if (!validation.status) {
                return res.status(400).json({
                    status: false,
                    message: 'Validation failed. Please fill all required fields.',
                    key: validation.key
                });
            }

            let userId = req.session && req.session.userId ? req.session.userId : null;
          
            if (req.session && req.user && req.user.userId) { 
                req.session.userId = req.user.userId; 
                userId = req.user.userId; 
            }

            const existingWishlist = await Whishlist.findOne({
                userId: userId,
                productId: fields.productId.toString()
            });

            if (existingWishlist) {
            
                existingWishlist.product_name = fields.product_name ? fields.product_name.toString() : '';
                await existingWishlist.save();
                res.status(200).json({
                    status: true,
                    message: 'Wishlist item updated successfully!',
                    user: existingWishlist
                });
            } else {
          
                const newWishlist = new Whishlist({
                    product_name: fields.product_name ? fields.product_name.toString() : '',
                    productId: fields.productId ? fields.productId.toString() : '',
                    userId: userId
                });

                await newWishlist.save();
                res.status(200).json({
                    status: true,
                    message: 'Product successfully added to wishlist!',
                    user: newWishlist
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: 'An error occurred while processing the wishlist item...',
                error: error.message
            });
        }
    },
    delete_data_WishlistItem: async (req, fields, files) => {
        try {
            var objectId = fields.object_id.toString();
            console.log(objectId)
            var collectionName = fields.collection_name.toString();
            var Model;
            var message = '';
            var status = false;
           

            if (collectionName === 'Delete-WishlistItem') {
                Model = Whishlist;
            } else {
                message = 'Invalid collection name!';
                return { status, message };
            }
            console.log("this is  the "+ objectId)
            var result = await Model.deleteOne({ _id: objectId });
            if (result.deletedCount === 0) {
                message = 'Document not found!';
                return { status, message };
            }

            status = true;
            message = 'Document successfully deleted!';
            return { status, message };
         
        } catch (error) {
            console.log(error);
            message = 'An error occurred while deleting the document...';
            error = error.message;
            return { status, message, error };
        }
    },
};



