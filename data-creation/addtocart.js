const express = require('express');
const formidable = require('formidable');
const Cart = require("../schema/addcart.js");
const validator = require('./validator.js');
const fs = require('fs');
const path = require('path');
const Product=require("../schema/add-product.js")

// module.exports = {
//     addcart_form: async (req, fields, files, res) => {
//         try {
//             const requiredFields = ["product_name", "productId"];
//             const validation = validator.check_required_fields(fields, requiredFields);

//             if (!validation.status) {
//                 return res.status(400).json({
//                     status: false,
//                     message: 'Validation failed. Please fill all required fields.',
//                     key: validation.key
//                 });
//             }

//             const productId = fields.productId.toString();
//             const productName = fields.product_name ? fields.product_name.toString() : '';
//             var userId = req.session && req.session.userId ? req.session.userId : null;
          
//             if (req.session && req.user && req.user.userId) { 
//                 req.session.userId = req.user.userId; 
//                 userId = req.user.userId; 
//             }

//             let cart = await Cart.findOne({ userId: userId, productId: productId });

//             if (!cart) {
//                 cart = new Cart({
//                     userId: userId,
//                     product_name: productName,
//                     productId: productId,
//                     quantity: '1'
//                 });
//             } else {
//                 cart.quantity = (Number(cart.quantity) + 1).toString();
//             }

//             await cart.save();
//             res.status(200).json({
//                 status: true,
//                 message: 'Product successfully added to cart!',
//                 cart: cart
//             });
//         } catch (error) {
//             console.log(error);
//             res.status(500).json({
//                 status: false,
//                 message: 'An error occurred while adding the product to the cart.',
//                 error: error.message
//             });
//         }
//     },
    
// };
module.exports = {
    addcart_form: async (req, fields, files, res) => {
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

            const productId = fields.productId.toString();
            const productName = fields.product_name ? fields.product_name.toString() : '';
            var userId = req.session && req.session.userId ? req.session.userId : null;

            if (req.session && req.user && req.user.userId) { 
                req.session.userId = req.user.userId; 
                userId = req.user.userId; 
            }

            let product = await Product.findOne({ productId: productId });

            if (!product) {
                return res.status(404).json({
                    status: false,
                    message: 'Product not found!'
                });
            }

            let cart = await Cart.findOne({ userId: userId, productId: productId });

            if (!cart) {
                cart = new Cart({
                    userId: userId,
                    product_name: productName,
                    productId: productId,
                    quantity: '1',
                    price: product.product_price
                });
            } else {
                cart.quantity = (Number(cart.quantity) + 1).toString();
                cart.price = (Number(cart.price) + product.product_price).toString();
            }

            await cart.save();
            res.status(200).json({
                status: true,
                message: 'Product successfully added to cart!',
                cart: cart
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: 'An error occurred while adding the product to the cart.',
                error: error.message
            });
        }
    },

    updateQuantity: async (req, fields, files, res) => {
        try {
            const productId = fields.object_id.toString();
            const newQuantity = Number(fields.quantity);
            const userId = req.session && req.session.userId ? req.session.userId : null;

            if (req.session && req.user && req.user.id) {
                req.session.userId = req.user.id;
                userId = req.user.id;
            }

            if (!productId || !userId) {
                return res.status(400).json({
                    status: false,
                    message: 'No product id or user id provided!'
                });
            }

            const cart = await Cart.findOne({ userId: userId, productId: productId });

            if (!cart) {
                return res.status(404).json({
                    status: false,
                    message: 'No cart item found!'
                });
            }

            const product = await Product.findOne({ productId: productId });

            if (!product) {
                return res.status(404).json({
                    status: false,
                    message: 'Product not found!'
                });
            }

            cart.quantity = newQuantity.toString();
            cart.price = (product.product_price * newQuantity).toString();

            await cart.save();

            res.status(200).json({
                status: true,
                message: 'Product quantity successfully updated in cart!',
                cart: cart
            });
        } catch (error) {
            console.log("An error occurred while updating quantity in cart: ", error);
            res.status(500).json({
                status: false,
                message: 'An error occurred while updating the product quantity in the cart.',
                error: error.message
            });
        }
    },
    delete_data_CartItem: async (req, fields, files) => {
        try {
            var objectId = fields.object_id.toString();
            console.log(objectId)
            var collectionName = fields.collection_name.toString();
            var Model;
            var message = '';
            var status = false;
           

            if (collectionName === 'Delete-CartItem') {
                Model = Cart;
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