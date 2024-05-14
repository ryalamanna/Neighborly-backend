import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AvailableUserRoles , UserRolesEnum } from '../../../constants.js'
dotenv.config();

const userSchema = new Schema(
    {
        // avatar: {
        //     type: {
        //         url: String,
        //         localPath: String,
        //     },
        //     default: {
        //         url: `https://via.placeholder.com/200x200.png`,
        //         localPath: '',
        //     },
        // },
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        role: {
            type: String,
            enum: AvailableUserRoles,
            default: UserRolesEnum.USER,
            required: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        // loginType: {
        //     type: String,
        //     enum: AvailableSocialLogins,
        //     default: UserLoginType.EMAIL_PASSWORD,
        // },
        // isEmailVerified: {
        //     type: Boolean,
        //     default: false,
        // },
        // refreshToken: {
        //     type: String,
        // },
        // forgotPasswordToken: {
        //     type: String,
        // },
        // forgotPasswordExpiry: {
        //     type: Date,
        // },
        // emailVerificationToken: {
        //     type: String,
        // },
        // emailVerificationExpiry: {
        //     type: Date,
        // },
    },
    { timestamps: true }
);
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const User = mongoose.model('User', userSchema);
