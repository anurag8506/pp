const express = require('express');
const formidable = require('formidable');
const Reviews = require("../schema/reviews.js");
const validator = require('./validator.js');
const fs = require('fs');
const path = require('path');
module.exports = {
    reviews_form: async (req, fields, files, res) => {
        try {
            const userId = req.session.userId;

            if (!userId) {
                return res.status(401).json({
                    status: false,
                    message: 'User not authenticated.'
                });
            }

            const requiredFields = ["reviews"];
            const validation = validator.check_required_fields(fields, requiredFields);

            if (!validation.status) {
                return res.status(400).json({
                    status: false,
                    message: 'Validation failed. Please fill all required fields.',
                    key: validation.key
                });
            }

            const reviews = fields.reviews ? fields.reviews.toString() : '';

            const existingReview = await Reviews.findOne({ userId: userId.toString() });

            if (existingReview) {
              
                existingReview.reviews = reviews;
                await existingReview.save();

                return res.status(200).json({
                    status: true,
                    message: 'Review successfully updated!',
                    user: existingReview
                });
            } else {
              
                const newReview = new Reviews({
                    reviews: reviews,
                    userId: userId.toString()
                });

                await newReview.save();

                return res.status(200).json({
                    status: true,
                    message: 'Review successfully created!',
                    user: newReview
                });
            }
        } catch (error) {
            console.error('Error processing review:', error);
            return res.status(500).json({
                status: false,
                message: 'An error occurred while processing the review.',
                error: error.message
            });
        }
    }
};
