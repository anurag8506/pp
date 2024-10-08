

const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const DataCreation_UserRegister = require("../../data-creation/user");
const DataCreation_User = require("../../data-creation/loginpage");

const DataCreation_Cart=require("../../data-creation/addtocart")
const DataCreation_Whishlist=require("../../data-creation/addtowhislist")



const DataCreation_UserOrder=require("../../data-creation/user_details_order")



const Cart=require("../../data-creation/addtocart")


require('dotenv').config();

router.use('/public', express.static('public'));

router.post("/admin_api", (req, res) => {
    const form = new formidable.IncomingForm({ allowEmptyFiles: true, minFileSize: 0 });
    form.parse(req, async (error, fields, files) => {
        if (error) {
            console.error('Error parsing form data:', error);
            return res.status(500).json({ status: false, message: 'An error occurred while parsing form data.' });
        }
        console.log('Form parsed successfully:');
        console.log('Fields:', fields);
        console.log('Files:', files);

        try {
            if (fields.data_method && fields.data_method.toString() === 'user_register_form') {
                await DataCreation_UserRegister.user_form(req, fields, files, res);
            } 
            else if (fields.data_method && fields.data_method.toString() === 'login_form') {
                await DataCreation_User.login_page_form(req, fields, files, res);
            }
            else if (fields.data_method && fields.data_method.toString() === 'add_reviews_form') {
                await DataCreation_Reviews.reviews_form(req, fields, files, res);
            }
            else if (fields.data_method == "add_to_cart_form") {
                await DataCreation_Cart.addcart_form(req, fields, files, res);
            }
            else if (fields.data_method == "add_to_whislist_form") {
                await DataCreation_Whishlist.addwhishlist_form(req, fields, files, res);
            }
            else if (fields.data_method == "Update-Quantity") {
                await Cart.updateQuantity(req, fields, files, res);
            }
            else if (fields.data_method == "checkOutForm") {
                await DataCreation_UserOrder.user_order(req, fields, files, res);
            }
               else if (fields.data_method == "delete_data") {
                console.log(fields)
                try {
                    let deletePromises = [];
                    let collectionName = fields.collection_name;
                    if (Array.isArray(collectionName)) {
                        collectionName = collectionName[0];
                    }
                    console.log('Collection name:', collectionName);

                    if (collectionName === 'Delete-CartItem') {
                        console.log('Deleting Course data...');
                        deletePromises.push(DataCreation_Cart.delete_data_CartItem(req, fields, files));
                    }
                    else if (collectionName === 'Delete-WishlistItem') {
                        console.log('Deleting Course data...');
                        deletePromises.push(DataCreation_Whishlist.delete_data_WishlistItem(req, fields, files));
                    }

                    await Promise.all(deletePromises);
                    res.json({ message: 'Data deleted successfully' });
                } catch (error) {
                    console.log('An error occurred:', error);
                    res.status(500).json({ error: 'An error occurred' });
                }
            }

            else {
                return res.status(400).json({ status: false, message: 'Invalid data method specified.' });
            }
        } catch (error) {
            console.error('Error handling form submission:', error);
            return res.status(500).json({ status: false, message: 'An error occurred while processing the form.' });
        }
    });
});



module.exports = router;
