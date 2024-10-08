const fs = require('fs').promises;
const path = require('path');
const UserRegister = require("../schema/user.js");
const validator = require('./validator.js');
const Cart = require("../schema/addcart.js")

module.exports = {
    user_form: async (req, fields, files, res) => {
        try {

            let existingUser = await UserRegister.findOne({ email: fields.email[0] });
            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    message: 'This email is already registered.'
                });
            }


            const generateStudentId = await UserRegister.findOne({}).sort({ 'UserId': -1 }).limit(1);
            let userId;
            if (!generateStudentId || !generateStudentId.UserId) {
                userId = "SKILLIE_STU_01";
            } else {
                const latestId = parseInt(generateStudentId.UserId.split('_')[2]) + 1;
                userId = `SKILLIE_STU_${latestId < 10 ? '0' : ''}${latestId}`;
            }


            const requiredFields = ["name", "mobileno", "email", "passaword", "repeatPassword"];
            const validation = validator.check_required_fields(fields, requiredFields);
            if (!validation.status) {
                return res.status(400).json({
                    status: false,
                    message: 'Validation failed. Please fill all required fields.',
                    key: validation.key
                });
            }

            const name = fields.name[0];
            const mobileno = fields.mobileno[0];
            const email = fields.email[0];
            const passaword = fields.passaword[0];
            const repeatPassword = fields.repeatPassword[0];


            if (passaword !== repeatPassword) {
                return res.status(400).json({
                    status: false,
                    message: 'Passwords do not match.'
                });
            }


            const profile = files.profileUpload && files.profileUpload[0];
            if (!profile) {
                return res.status(400).json({
                    status: false,
                    message: 'Profile proof is required.'
                });
            }

            const profileValidation = validator.thumbnailValidator(profile, 'profile');
            if (!profileValidation.status) {
                return res.status(400).json({
                    status: false,
                    message: 'Validation failed. Please upload a valid profile proof (PDF format).',
                    key: profileValidation.key
                });
            }

            const profilePath = '/uploads/' + profile.newFilename;
            const targetDirectory = path.join(__dirname, '../public/uploads');
            await fs.mkdir(targetDirectory, { recursive: true });

            const newFilePath = path.join(targetDirectory, profile.newFilename);
            await fs.copyFile(profile.filepath, newFilePath);
            await fs.unlink(profile.filepath);


            const user = new UserRegister({
                name: name,
                mobileno: mobileno,
                email: email,
                profile: profilePath,
                passaword: passaword,
                UserId: userId,
                student_id: userId
            });
            if (req.session.userId) {
                await Cart.updateMany({ userId: req.session.userId }, { userId: user.UserId });
                console.log("Updated Cart userId: ", user.UserId);
            }

            req.session.userId = user.UserId;
            await user.save();
            res.status(200).json({
                status: true,
                message: 'User successfully created!',
                user: user,
                url: '/home'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: false,
                message: 'An error occurred while creating the User...',
                error: error.message
            });
        }
    }
};
