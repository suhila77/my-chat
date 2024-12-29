const User_info = require('../models/Users_Schema');
const asyncWrapper = require('../middleware/asyncWrapper');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const generateToken = require('../utils/generate_token');
const AppError = require('../utils/AppError')
const httpstatus = require('../utils/http_status');


const user_register = asyncWrapper(
    async (req, res, next) => {
        const { firstName, lastName, sex, email, password } = req.body;

        if (!validator.isEmail(email)) {
            let error = AppError.create("Invalid email",  400, httpstatus.FAIL);
            return next(error);
        }

        const old_user = await User_info.findOne({ email });
        if (old_user) {
            let error = AppError.create("User already exists",  400, httpstatus.FAIL);
            return next(error);
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const userPhoto = req.file ? req.file.filename : null;

        const new_user = new User_info({
            firstName,
            lastName,
            sex,
            email,
            password: hashedPassword,
            photo: userPhoto,
        });
        const token =  await generateToken({email: new_user.email, id: new_user._id});
        await new_user.save();

        res.status(201).json({
            status: httpstatus.SUCCESS,
            data: { user: new_user , my_token: token},
        });
});

const user_login = asyncWrapper(
    async(req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            let error = AppError.create("Email and password are required",  400, httpstatus.FAIL);
            return next(error);
        }

        const user = await User_info.findOne({ email });
        if (!user) {
            let error = AppError.create("User not found",  404, httpstatus.FAIL);
            return next(error);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            let error = AppError.create("Invalid credentials",  401, httpstatus.FAIL);
            return next(error);
        }
        const token = await generateToken({email: user.email, id: user._id});
        
        res.status(200).json({
            status: httpstatus.SUCCESS,
            data: { message: "Login successful", my_token: token}
        });
});

module.exports = {
    user_register,
    user_login,
};