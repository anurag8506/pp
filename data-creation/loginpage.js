const UserRegister = require("../schema/user.js");
const validator = require('./validator.js');
const formidable = require('formidable');
const Cart = require("../schema/addcart.js")

// module.exports = {
//     login_page_form: async (req, fields, files, res) => {
//         try {
//             const { email, passaword } = fields;

//             if (!email || !passaword) {
//                 return res.status(400).json({
//                     status: false,
//                     message: 'Email and passaword are required'
//                 });
//             }

//             const user = await UserRegister.findOne({ email: email });

//             if (!user) {
//                 return res.status(200).json({
//                     status: false,
//                     message: 'User not found'
//                 });
//             }

//             if (String(user.passaword) !== String(passaword)) {
//                 return res.status(200).json({
//                     status: false,
//                     message: 'Incorrect passaword',
//                 });
//             }


//             if (!req.session.userId) {
//                 req.session.userId = user.UserId;
//                 console.log("session userId : ", req.session.userId);
//             }

//             res.status(200).json({
//                 status: true,
//                 message: 'Authorized Redirecting..',
//                 url: '/home'
//             });
//         } catch (error) {
//             console.error('Error:', error);
//             res.status(500).json({
//                 status: false,
//                 message: 'An error occurred while processing the login request.'
//             });
//         }
//     }
// };
module.exports = {
    login_page_form: async (req, fields, files, res) => {
        try {
            const { email, passaword } = fields;

            if (!email || !passaword) {
                return res.status(400).json({
                    status: false,
                    message: 'Email and passaword are required'
                });
            }

            const user = await UserRegister.findOne({ email });

            if (!user) {
                return res.status(200).json({
                    status: false,
                    message: 'User not found'
                });
            }

            if (String(user.passaword) !== String(passaword)) {
                return res.status(200).json({
                    status: false,
                    message: 'Incorrect passaword',
                });
            }


            if (req.session.userId && req.session.userId !== user.UserId) {
                await Cart.updateMany({ userId: req.session.userId }, { userId: user.UserId });
                console.log("Updated Cart userId from", req.session.userId, "to", user.UserId);
            }


            req.session.userId = user.UserId;
            console.log("Session userId updated to:", req.session.userId);

            res.status(200).json({
                status: true,
                message: 'Authorized Redirecting..',
                url: '/home'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                status: false,
                message: 'An error occurred while processing the login request.'
            });
        }
    }
};
