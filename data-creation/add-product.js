const express = require('express');
const formidable = require('formidable');
const Product = require("../schema/add-product.js");
const validator = require('./validator.js');
const fs = require('fs');
const path = require('path');
// module.exports = {
//     product_form: async (req, fields, files, res) => {
//         try {
//             const requiredFields = [
//                 "product_name", "product_short_details", "product_main_details", "product_price", "discount_price", "categories",
//                 "dimensions_width", "dimensions_height", "dimensions_depth", "rating","stock","product_brand","sku","product_weight",
//             ];

//             const validation = validator.check_required_fields(fields, requiredFields);

//             if (!validation.status) {
//                 return res.status(400).json({
//                     status: false,
//                     message: 'Validation failed. Please fill all required fields.',
//                     key: validation.key
//                 });
//             }

//             const product_img = files.product_imgupload && files.product_imgupload[0];
//             if (!product_img) {
//                 return res.status(400).json({
//                     status: false,
//                     message: 'Product image is required.'
//                 });
//             }

//             const product_imgValidation = validator.thumbnailValidator(product_img, 'product_img');
//             if (!product_imgValidation.status) {
//                 return res.status(400).json({
//                     status: false,
//                     message: 'Validation failed. Please upload a valid image.',
//                     key: product_imgValidation.key
//                 });
//             }

//             const product_imgPath = '/uploads/' + product_img.newFilename;
//             fs.renameSync(product_img.filepath, path.join(__dirname, '../public' + product_imgPath));

//             const generateProductId = await Product.findOne({}).sort({ 'productId': -1 }).limit(1);
//             let productId;
//             if (!generateProductId || !generateProductId.productId) {
//                 productId = "PRODUCT_01";
//             } else {
//                 const latestId = parseInt(generateProductId.productId.split('_')[1]) + 1;
//                 productId = `PRODUCT_${latestId < 10 ? '0' : ''}${latestId}`;
//             }

//             const dimensions = {
//                 width: parseFloat(fields.dimensions_width),
//                 height: parseFloat(fields.dimensions_height),
//                 depth: parseFloat(fields.dimensions_depth)
//             };

//             const user = new Product({
//                 product_name: fields.product_name ? fields.product_name.toString() : '',
//                 discount_price: fields.discount_price ? fields.discount_price.toString() : '',
//                 product_price: fields.product_price ? fields.product_price.toString() : '',
//                 product_img: product_imgPath.toString(),
//                 product_short_details: fields.product_short_details ? fields.product_short_details.toString() : '',
//                 product_main_details: fields.product_main_details ? fields.product_main_details.toString() : '',
//                 categories: fields.categories ? fields.categories.toString() : '',


//                stock: fields.stock ? fields.stock.toString() : '',
//                product_brand: fields.product_brand ? fields.product_brand.toString() : '',
//                product_weight: fields.product_weight ? fields.product_weight.toString() : '',
//               sku: fields.sku ? fields.sku.toString() : '',
//                 dimensions: dimensions,
//                 rating: parseFloat(fields.rating),
//                 productId: productId.toString()
//             });

//             await user.save();
//             res.status(200).json({
//                 status: true,
//                 message: 'Product successfully created!',
//                 user: user
//             });
//         } catch (error) {
//             console.log(error);
//             res.status(500).json({
//                 status: false,
//                 message: 'An error occurred while creating the product...',
//                 error: error.message
//             });
//         }
//     }
// };

module.exports = {
    product_form: async (req, fields, files, res) => {
        try {
            const requiredFields = [
                "product_name", "product_short_details", "product_main_details", "product_price", "discount_price", "categories",
                "dimensions_width", "dimensions_height", "dimensions_depth", "rating","stock","product_brand","sku","product_weight",
            ];

            const validation = validator.check_required_fields(fields, requiredFields);

            if (!validation.status) {
                return res.status(400).json({
                    status: false,
                    message: 'Validation failed. Please fill all required fields.',
                    key: validation.key
                });
            }

            if (!files || !files['product_images[]'] || files['product_images[]'].length === 0) {
                return res.status(400).json({
                    status: false,
                    message: 'At least one product image is required.'
                });
            }

            const imagePaths = [];
            for (const file of files['product_images[]']) {
                const product_imgValidation = validator.thumbnailValidator(file, 'product_img');
                if (!product_imgValidation.status) {
                    return res.status(400).json({
                        status: false,
                        message: 'Validation failed. Please upload a valid image.',
                        key: product_imgValidation.key
                    });
                }

                const product_imgPath = '/uploads/' + file.newFilename;
                fs.renameSync(file.filepath, path.join(__dirname, '../public' + product_imgPath));
                imagePaths.push(product_imgPath);
            }

            const generateProductId = await Product.findOne({}).sort({ 'productId': -1 }).limit(1);
            let productId;
            if (!generateProductId || !generateProductId.productId) {
                productId = "PRODUCT_01";
            } else {
                const latestId = parseInt(generateProductId.productId.split('_')[1]) + 1;
                productId = `PRODUCT_${latestId < 10 ? '0' : ''}${latestId}`;
            }

            const dimensions = {
                width: parseFloat(fields.dimensions_width),
                height: parseFloat(fields.dimensions_height),
                depth: parseFloat(fields.dimensions_depth)
            };

            const user = new Product({
                product_name: fields.product_name ? fields.product_name.toString() : '',
                discount_price: fields.discount_price ? fields.discount_price.toString() : '',
                product_price: fields.product_price ? fields.product_price.toString() : '',
                images: imagePaths,
                product_short_details: fields.product_short_details ? fields.product_short_details.toString() : '',
                product_main_details: fields.product_main_details ? fields.product_main_details.toString() : '',
                categories: fields.categories ? fields.categories.toString() : '',
                stock: fields.stock ? fields.stock.toString() : '',
                product_brand: fields.product_brand ? fields.product_brand.toString() : '',
                product_weight: fields.product_weight ? fields.product_weight.toString() : '',
                sku: fields.sku ? fields.sku.toString() : '',
                dimensions: dimensions,
                rating: parseFloat(fields.rating),
                productId: productId.toString()
            });

            await user.save();
            res.status(200).json({
                status: true,
                message: 'Product successfully created!',
                user: user
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: 'An error occurred while creating the product...',
                error: error.message
            });
        }
    }
};
