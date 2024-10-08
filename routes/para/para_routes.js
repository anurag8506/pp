
const express = require('express');
const router = express.Router();
require('dotenv').config();
const formidable = require('formidable');
router.use('/public', express.static('public'));
const mongoose = require('mongoose');
const Product = require("../../schema/add-product")
const Cart = require("../../schema/addcart")
const Whishlist = require("../../schema/whishlist")
const Zipcode = require("../../schema/zipcode")
const Checkoutform = require("../../data-creation/checkoutform");
const Categories = require("../../schema/add_categories")
const UserOrder=require("../../schema/user_order")


const paymentController = require('../../data-creation/paymentController');


const path = require('path');




mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const fs = require('fs');
const addtocart = require('../../data-creation/addtocart');
const { Console } = require('console');
// const checkLoggedIn = (req, res, next) => {
//     if (!req.session.userId) {
//         res.redirect('/loginpage');
//     } else {
//         next();
//     }
// };
function checkLoggedIn(req, res, next) {
    if (!req.session.userId) {
        req.session.userId = getRandomUserId();
        req.session.loginTime = new Date();
        req.session.save((err) => {
            if (err) {
                console.log("Error saving session: ", err);
            } else {
                console.log("Session saved successfully");
                next();
            }
        });
    } else {
        next();
    }
}
function getRandomUserId() {
    const date = new Date();
    const timestamp = date.getTime();
    console.log(`User ID generated at: ${date}`);
    return `${Math.floor(Math.random() * 1000000)}_${timestamp}`;
}

router.get('/loginpage', (req, res) => {
    res.render('loginpage');
});
router.get('/user-register', (req, res) => {
    res.render('user-register');
});

router.get('/add_categories', checkLoggedIn, (req, res) => {
    res.render('add_categories');
});

router.get('/categories', checkLoggedIn, async (req, res) => {
    try {
        const userId = req.session.userId;
        const categoryFilter = req.query.category || 'All';  
        console.log("User_id", userId);
        const productQuery = categoryFilter === 'All' ? {} : { categories: categoryFilter };
        const Product_data = await Product.find(productQuery);

        const Cart_data = await Cart.find({ userId });
        const Categories_data = await Categories.find({}); 
        const processedProducts = Product_data.map(product => ({
            ...product._doc,
            truncatedName: truncateContent(product.product_name, 100),
            inCart: Cart_data.some(cartItem => cartItem.productId.toString() === product._id.toString())
        }));
        res.render('categories', {
            Product: processedProducts,
            Cart: Cart_data,
            Categories: Categories_data,
            activeCategory: categoryFilter
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("An error occurred while fetching products.");
    }
});

function truncateContent(content, maxWords) {
    let words = content.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return content;
}



router.get('/home', checkLoggedIn, async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log("User_id", userId);
        const Product_data = await Product.find({});
        const Cart_data = await Cart.find({ userId });
        const Categories_data = await Categories.find({});
        const processedProducts = Product_data.map(product => ({
            ...product._doc,
            truncatedName: truncateContent(product.product_name, 100),
            inCart: Cart_data.some(cartItem => cartItem.productId.toString() === product._id.toString())
        }));
        res.render('home', {
            Product: processedProducts,
            Cart: Cart_data,
            Categories: Categories_data
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("An error occurred while fetching products.");
    }
});

router.get('/faq', (req, res) => {
    res.render('faq');
});

router.get('/aboutus', (req, res) => {
    res.render('aboutus');
});

router.get('/whoweare', (req, res) => {
    res.render('whoweare');
});

router.get('/contactus', (req, res) => {
    res.render('contactus');
});

router.get('/productdetails/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const Product_data = await Product.findById(productId);

        if (!Product_data) {
            return res.status(404).send('Product not found');
        }

        res.render('productdetails', {
            Product: Product_data
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});



router.post('/update-quantity', addtocart.updateQuantity);

router.get('/cart', checkLoggedIn, async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log("User_id", userId);

        const Cart_data = await Cart.aggregate([
            {
                $match: { userId: userId }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "productId",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $project: {
                    productId: 1,
                    userId: 1,
                    product_name: 1,
                    quantity: 1,
                    date: 1,
                    productDetails: 1
                }
            }
        ]);

        console.log("Cart data: ", JSON.stringify(Cart_data, null, 2));

        const Product_data = await Product.find({});

        res.render('cart', {
            status: true,
            message: 'Courses successfully fetched!',
            Cart: Cart_data,
            Product: Product_data
        });
    } catch (error) {
        console.log("An error occurred while fetching the data: ", error);
        res.render('cart', {
            status: false,
            message: 'An error occurred while fetching the data',
            Cart: [],
            Product: []
        });
    }
});
router.get('/whislist', checkLoggedIn, async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log("User_id", userId);

        const Whishlist_data = await Whishlist.aggregate([
            {
                $match: { userId: userId }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "productId",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $project: {
                    productId: 1,
                    userId: 1,
                    product_name: 1,
                    quantity: 1,
                    date: 1,
                    productDetails: 1
                }
            }
        ]);

        console.log("Cart data: ", JSON.stringify(Whishlist_data, null, 2));

        const Product_data = await Product.find({});

        res.render('whislist', {
            status: true,
            message: 'Courses successfully fetched!',
            Whishlist: Whishlist_data,
            Product: Product_data
        });
    } catch (error) {
        console.log("An error occurred while fetching the data: ", error);
        res.render('cart', {
            status: false,
            message: 'An error occurred while fetching the data',
            Cart: [],
            Product: []
        });
    }
});
router.get('/checkout', checkLoggedIn, async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log("User_id", userId);

        const Cart_data = await Cart.aggregate([
            {
                $match: { userId: userId }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "productId",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $project: {
                    productId: 1,
                    userId: 1,
                    product_name: 1,
                    quantity: 1,
                    date: 1,
                    productDetails: 1
                }
            }
        ]);

        console.log("Cart data: ", JSON.stringify(Cart_data, null, 2));

        const Product_data = await Product.find({});

        res.render('checkout', {
            status: true,
            message: 'Courses successfully fetched!',
            Cart: Cart_data,
            Product: Product_data
        });
    } catch (error) {
        console.log("An error occurred while fetching the data: ", error);
        res.render('cart', {
            status: false,
            message: 'An error occurred while fetching the data',
            Cart: [],
            Product: []
        });
    }
});




router.post('/get-location', async (req, res) => {
    const zipcode = req.body.Zipcode.toString();
    var serviceProvide = await Checkoutform.getexpectedDelivery(zipcode);
    console.log(serviceProvide);
    console.log('ZIP code (server):', zipcode);

    const location = await Zipcode.find({ zipcode: zipcode });
    console.log("hi am your location", location)

    if (location) {
        res.json({ location: location, serviceProvide: serviceProvide });
    } else {
        res.json({ error: 'No location found for this ZIP code' });
    }
});




router.get('/razerpay/:orderId',  async (req, res) => {
    const orderId = req.params.orderId.toString();
    req.session.orderId = orderId;
    var userId = req.session && req.session.userId ? req.session.userId : null;
    if (req.session && req.user && req.user.id) {
        req.session.userId = req.user.id;
        userId = req.user.id;
    }
    console.log(orderId);
    const UserOrder_data = await UserOrder.find({ orderId: req.session.orderId,userId: userId });

    console.log(UserOrder_data);
    res.render('razerpay', {
        paymentstatus: 'paid',
        message: 'Courses successfully fetched!',
        UserOrder: UserOrder_data,
     
    })
});

// router.post('/updateOrder', async (req, res) => {
//     try {
//         const { orderId, paymentAmount, paymentstatus, transactionId, razorpay_orderId } = req.body;

//         if (!orderId || !transactionId) {
//             return res.status(400).json({ success: false, msg: "Missing order ID or transaction ID" });
//         }

//         const order = await UserOrder.findOne({ orderId: req.session.orderId });

//         if (!order) {
//             return res.status(404).json({ success: false, msg: "Order not found" });
//         }
//         order.paymentAmount = paymentAmount;
//         order.paymentstatus = paymentstatus;
//         order.transactionId = transactionId;
//         order.razorpay_orderid = razorpay_orderId; 
//         order.paymentDate = new Date();

//         await order.save();

//         console.log(razorpay_orderId)
//         res.json({ success: true, paymentstatus: order.paymentstatus, orderId: order.orderId });
//     } catch (error) {
//         console.error('Error updating order:', error);
//         res.status(500).json({ success: false, msg: "Internal server error" });
//     }
// });
router.post('/updateOrder', async (req, res) => {
    try {
        const { orderId, paymentstatus, paymentDate, paymentAmount } = req.body;
        const order = await mongoose.model('UserOrder').findOne({ orderId: req.session.orderId });


        if (order) {
            order.paymentstatus = paymentstatus;
            order.confirmOrderId = orderId;
            order.paymentDate = new Date(paymentDate);
            order.paymentAmount = parseFloat(paymentAmount) / 100;
            const updatedOrder = await order.save();
            console.log(orderId)

            if (updatedOrder) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Failed to save updated order' });
            }
        } else {
            res.json({ success: false, message: 'Order not found' });
        }
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Error updating order: ' + err.message });
    }
});



router.get('/completeRazorpay/:orderId',async (req, res) => {
    const orderId = req.params.orderId;
    req.session.orderId = orderId;
    console.log("session", req.session.orderId, req.params.orderId)
    var userId = req.session && req.session.userId ? req.session.userId : null;
    if (req.session && req.user && req.user.id) {
        req.session.userId = req.user.id;
    }
    const UserOrder_data = await UserOrder.findOne({ orderId: orderId,userId: userId });

    const paymentStatus = await paymentController.checkPaymentStatus(orderId);
    console.log(`Payment Status: ${paymentStatus}`);
    if (paymentStatus === 'paid') {
        await Cart.deleteMany({ userId: userId });
        console.log('Cart cleared for user:', userId);
    }

    res.redirect(`/paymentcompleted?orderId=${orderId}&paymentstatus=${paymentStatus}`);
});

router.post('/createOrder', paymentController.createOrder);


module.exports = router;

