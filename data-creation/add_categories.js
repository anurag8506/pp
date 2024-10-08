const express = require('express');
const formidable = require('formidable');
const Categories = require("../schema/add_categories.js");
const validator = require('./validator.js');
const fs = require('fs');
const path = require('path');
module.exports = {
   categories_form: async (req, fields, files, res) => {
        try {
            const requiredFields = ["categories_name"];
            const validation = validator.check_required_fields(fields, requiredFields);
            if (!validation.status) {
                return res.status(400).json({
                    status: false,
                    message: 'Validation failed. Please fill all required fields.',
                    key: validation.key
                });
            }

            const  categories_img = files.categories_imgupload && files.categories_imgupload[0];
            if (!categories_img) {
                return res.status(400).json({
                    status: false,
                    message: 'Categories image is required.'
                });
            }

            const categories_imgValidation = validator.thumbnailValidator(categories_img, 'categories_img');
            if (!categories_imgValidation.status) {
                return res.status(400).json({
                    status: false,
                    message: 'Validation failed. Please upload a valid image.',
                    key: categories_imgValidation.key
                });
            }

            const categories_imgPath = '/uploads/' + categories_img.newFilename;
            fs.renameSync(categories_img.filepath, path.join(__dirname, '../public' + categories_imgPath));

            const generateCategoriesId = await Categories.findOne({}).sort({ 'categoriesId': -1 }).limit(1);
            let categoriesId;
            if (!generateCategoriesId || !generateCategoriesId.categoriesId) {
                categoriesId= "CATEGORIES_01";
            } else {
                const latestId = parseInt(generateCategoriesId.categoriesId.split('_')[1]) + 1;
                categoriesId = `CATEGORIES_${latestId < 10 ? '0' : ''}${latestId}`;
            }

       
            const user = new Categories({
                categories_name: fields.categories_name ? fields.categories_name.toString() : '',
         
                categories_img: categories_imgPath.toString(),
             
                categoriesId:categoriesId.toString()
            });

            await user.save();
            res.status(200).json({
                status: true,
                message: 'Categories successfully created!',
                user: user
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: 'An error occurred while creating the categories...',
                error: error.message
            });
        }
    }
};
