const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { getDB } = require('./dbconnection')


const { getUserByEmailId, updateUser } = require('../controllers/user');

const userRouter = express.Router()

userRouter.post('/reset-password-otp', async (req, res, next) => {
    try {
        const email = req.body.emailId;

        let user = await getUserByEmailId(email)
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpPasswordCombo = user.password + otp.toString()
        const otpPasswordHash = await bcrypt.hash(otpPasswordCombo, 10)

        console.log(user.password, otpPasswordHash)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ust.cis.ems@gmail.com', // Enter your Gmail email address
                pass: 'urpt tvap lhha febw' // Enter your Gmail password
            }
        });

        const mailOptions = {
            from: 'ust.cis.ems@gmail.com', // Sender email address
            to: email,
            subject: 'Reset password for CIS UST',
            text: `The OTP to reset your password is ${otp}`
        };

        console.log("mailOptions", mailOptions)
        
        res.status(200).json({ 
            result: "success",
            message: 'Reset password OTP sent successfully',
            hash: otpPasswordHash
        });
        
        await transporter.sendMail(mailOptions);
    
    } catch (error) {
        console.log("Error occured", error)
        next(error)
    }
});

userRouter.post('/verify-otp', async (req, res, next) => {
    try {
        const { emailId: email, otp, hashValue } = req.body;

        let user = await getUserByEmailId(email)
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        
        const otpPasswordCombo = user.password + otp;
        const verified = await bcrypt.compare(otpPasswordCombo, hashValue)

        if (verified) {
            res.status(200).json({
                result: "success",
                message: "OTP Successfully verified"
            })
        } else {
            res.status(200).json({
                result: "failed",
                message: "OTP verification failed"
            })
        }
        
    } catch (error) {
        console.log("error occured", error)
        next(error)
    }
})

userRouter.post('/reset-password', async (req, res, next) => {
    try {
        const { emailId: email, newPassword } = req.body;
        console.log("eeeeeeeeee", email)

        let user = await getUserByEmailId(email)
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

       let result =  await updateUser(email, { password: hashedPassword });
       
       if (result.modifiedCount) {
            res.status(200).json({
                result: "success",
                message: "Password succesfully reset"
            })
       } else {
            res.status(200).json({
                result: "failed",
                message: "Password reset failed"
            })
       }        
    } catch (error) {
        console.log("Error occured", error)
        next(error)
    }
})

module.exports = userRouter