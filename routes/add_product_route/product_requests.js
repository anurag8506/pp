const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

router.use('/public', express.static('public'));

const DataCreation_UserRegister = require("../../data-creation/user");
const DataCreation_User = require("../../data-creation/loginpage");
const DataCreation_Prodcut = require("../../data-creation/add-product")
const DataCreation_Categories = require("../../data-creation/add_categories")


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
            else if (fields.data_method && fields.data_method.toString() === 'add_product_form') {
                await DataCreation_Prodcut.product_form(req, fields, files, res);
            }
            else if (fields.data_method && fields.data_method.toString() === 'add_categories_form') {
                await DataCreation_Categories.categories_form(req, fields, files, res);
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
