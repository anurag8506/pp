const fs = require('fs');
const path = require('path');
const formidable = require("formidable");
const validator = require("./validator.js");
const axios = require('axios');
const UserOrder = require("../schema/user_order.js");
const UserRegister = require("../schema/user.js");
const Cart = require("../schema/addcart.js")



module.exports = {
    user_order: async (req, fields, files, res) => {
        try {

            const monthName = new Date().toLocaleString('default', { month: 'long' }).toUpperCase();
            const generateOrderId = await UserOrder.findOne({ orderId: { $regex: `^PP_${monthName}_` } }).sort({ 'orderId': -1 }).limit(1);
            let orderId;
            if (!generateOrderId || !generateOrderId.orderId) {
                orderId = `PP_${monthName}_01`;
            } else {
                const latestId = parseInt(generateOrderId.orderId.split('_')[2]) + 1;
                orderId = `PP_${monthName}_${latestId < 10 ? '0' : ''}${latestId}`;
            }

            let userId = req.session && req.session.userId ? req.session.userId : null;
            const name = fields.name ? fields.name.toString() : '';
            const email = fields.email ? fields.email.toString() : '';
            const mobileno = fields.mobileno ? fields.mobileno.toString() : '';
            const address = fields.address ? fields.address.toString() : '';
            const zipcode = fields.zipcode ? fields.zipcode.toString() : '';
            const town = fields.town ? fields.town.toString() : '';
            const state = fields.state ? fields.state.toString() : '';
            const grandTotal = fields.grandTotal ? fields.grandTotal.toString() : '';
            const paymentMethod = fields.paymentMethod ? fields.paymentMethod.toString() : '';
            const shippingOption = fields.shippingOption ? fields.shippingOption.toString() : '';
            const productId = fields['productId[]'] || [];
            const productNames = fields['productName[]'] || [];
            const productPrices = fields['productPrice[]'] || [];
            const productQuantities = fields['productQuantity[]'] || [];
            const image = fields['image[]'] || [];

            const productOrders = productNames.map((name, index) => ({
                productName: name,
                productPrice: productPrices[index] || 0,
                productQuantity: productQuantities[index] || 0,
                productId: productId[index] || '',
                image: image[index] || '',
            }));

            let user = await UserRegister.findOne({ email: email });

            if (user) {
                userId = user.UserId;
                console.log("User already exists. Using existing UserId.");
            } else {
                user = new UserRegister({
                    name: name,
                    email: email,
                    mobileno: mobileno,
                    UserId: userId
                });
                await user.save();
                userId = user.UserId;
                console.log("New user created.");
            }


            const userOrder = new UserOrder({
                orderId: orderId,
                address: address,
                zipcode: zipcode,
                town: town,
                state: state,
                products: productOrders,
                shippingOption: shippingOption,
                paymentMethod: paymentMethod,
                name: name,
                email: email,
                mobileno: mobileno,
                userId: userId,
                grandTotal: grandTotal,

            });

            await userOrder.save();
            req.session.userId = userId;
            req.session.orderId = orderId;

            if (paymentMethod === 'Cards') {
                return res.status(200).json({
                    status: true,
                    message: 'Order successfully created! Redirecting you to payment Page',
                    url: `http://localhost:8000/razerpay/${orderId}`
                });
            } else if (paymentMethod === 'UPI') {
                return res.status(200).json({
                    status: true,
                    message: 'Order successfully created! Redirecting you to order confirmation Page',
                    url: `http://localhost:8000/order-confirmation?orderId=${orderId}`
                });
            } else if (paymentMethod === 'Net Banking') {
                return res.status(200).json({
                    status: true,
                    message: 'Order successfully created! Redirecting you to bank transfer Page',
                    url: `http://localhost:8000/directbanktransfer/${orderId}`
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Order successfully created!',
                });
            }

        } catch (error) {
            console.error('Error processing order:', error);
            return res.status(500).json({
                status: false,
                message: 'An error occurred while processing the order.',
                error: error.message,
            });
        }
    },
    updateOrderStatus: async (req, res) => {
        try {
            const { orderId, paymentAmount, paymentstatus, transactionId, razorpay_orderid } = req.body;

            if (!orderId || !transactionId || !razorpay_orderid) {
                return res.status(400).json({ success: false, msg: "Missing required fields" });
            }

            const order = await UserOrder.findOne({ orderId: orderId });

            if (!order) {
                return res.status(404).json({ success: false, msg: "Order not found" });
            }
            order.paymentDate = new Date(); 
            order.paymentAmount = paymentAmount;
            order.paymentstatus = paymentstatus;
            order.transactionId = transactionId;
            order.razorpay_orderid = razorpay_orderid;

            await order.save();
            console.log("hi i am your orderid ", razorpay_orderid);

            res.json({ success: true, paymentstatus: order.paymentstatus, orderId: order.orderId });
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({ success: false, msg: "Internal server error" });
        }
    },
    updateTransactionId: async (req, res) => {
        try {
            const { transactionId, razorpay_orderid } = req.body;
            const userId = req.session.userId;

            if (!transactionId || !userId || !razorpay_orderid) {
                console.log("Missing transaction id, user id or razorpay order id!");
                return res.status(400).json({
                    status: false,
                    message: 'Required fields are missing!'
                });
            }

            const order = await UserOrder.findOne({ userId: userId, razorpay_orderid: razorpay_orderid });

            if (!order) {
                return res.status(404).json({
                    status: false,
                    message: 'Order not found!'
                });
            }

            order.transactionId = transactionId;
            order.paymentstatus = 'paid';
            order.paymentDate = new Date(); 
            await order.save();

            // Empty the Cart for the same userId
            await Cart.deleteMany({ userId: userId });

            res.status(200).json({
                status: true,
                message: 'Transaction ID updated and cart emptied successfully!',
                orderId: order.orderId
            });
        } catch (error) {
            console.error("Error updating transaction ID: ", error);
            return res.status(500).json({
                status: false,
                message: 'An error occurred: ' + error.message
            });
        }
    },


    updateTransactionIdfun: async (req, fields, files, res) => {
        console.log("Received request to update transaction id...");
        try {
            var transactionId = fields.transactionId.toString();
            var userId = req.session.userId;
            if (!transactionId || !userId) {
                console.log("No transaction id or user id provided!", transactionId, userId);
                res.status(400).json({
                    status: false,
                    message: 'No transaction id or user id provided!'
                });
                return;
            }

            await UserOrder.updateMany(
                { userId: userId },
                { $set: { transactionId: transactionId } }
            );

            console.log("Successfully updated transaction id!");

            // Empty the Cart for the same userId
            await Cart.deleteMany({ userId: userId });
            console.log("Successfully emptied the cart!");

            res.status(200).json({
                status: true,
                message: 'Transaction id successfully updated and cart emptied!'
            });
        } catch (error) {
            console.log("An error occurred: ", error);
            res.status(500).json({
                status: false,
                message: 'An error occurred: ' + error.message
            });
        }
    }

};









