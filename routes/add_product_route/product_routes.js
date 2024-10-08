
const express = require('express');
const router = express.Router();
require('dotenv').config();
const formidable = require('formidable');
router.use('/public', express.static('public'));
const mongoose = require('mongoose');
const path = require('path');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const fs = require('fs');


const checkLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/loginpage');
    } else {
        next();
    }
};


router.get('/loginpage', (req, res) => {
    res.render('loginpage');
});
router.get('/user-register', (req, res) => {
    res.render('user-register');
});

router.get('/add-product', checkLoggedIn, (req, res) => {
    res.render('add_product/add-product');
});
router.get('/add_categories', checkLoggedIn, (req, res) => {
    res.render('add_product/add_categories');
});



module.exports = router;

