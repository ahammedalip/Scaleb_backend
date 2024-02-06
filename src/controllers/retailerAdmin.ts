import { NextFunction, Request, Response } from "express"
import session from 'express-session'
import retailerAdmin from "../models/retailerAdmin";
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer'



export const retailValidation = async (req: Request, res: Response, next: NextFunction) => {
    const { retailerName, email, password, } = req.body
    console.log(req.body);
    try {
        const existingRetailer = await retailerAdmin.findOne({ retailerName })
        const existingEmail = await retailerAdmin.findOne({ email })
        if (existingRetailer) {
            res.status(400).json({ success: false, message: 'Retailer name already exists' })
        }
        if (existingEmail) {
            res.status(400).json({ success: false, message: 'Email already exists' })
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'ahmd.work12@gmail.com',
                pass: 'awbs lrfg gwgv zqvg'
            }
        })

        const generatedOTP: number = Math.floor(100000 + Math.random() * 900000);
        console.log('generated OTP is ', generatedOTP);
        req.session.generatedOTP = generatedOTP;
        req.session.save()
        console.log('generated OTP from session is ', req.session.generatedOTP);

        const mailOptions = {
            from: 'ahmd.work12@gmail.com',
            to: req.body.email, // User's email
            subject: 'OTP Verification',
            text: `Your OTP for verification of Scale.b is  : ${generatedOTP}. 
            Do not share the OTP with anyone.
            For further details and complaints visit www.scale.b.online`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).json({ success: false, message: "Error at sending mail" })
            } else {
                console.log('Email sent: ' + info.response);
                res.status(250).json({ success: true, message: 'OTP send succesfully' })
            }
        });       
    } catch (err) {
        console.log('error at retailer signup', err)
        if (err.code === 11000) {
            const keyValue = err.keyValue
            // console.log(err.keyValue);
            res.status(409).json({ success: false, message: `${keyValue} already exists` })
        }
    }
}

export const otpVerification = async (req: Request, res: Response) => {
    const { formData, otp } = req.body;
    console.log('otp from req.body', otp);
    console.log('otp from session', req.session.generatedOTP);
    const { retailerName, email, password } = formData;
    const isValidOTP = req.session.generatedOTP === otp
    console.log(isValidOTP);
        try {
            if(isValidOTP){
                const hashedPass = bcryptjs.hashSync(password, 2)
            const newRetailer = new retailerAdmin({
                retailerName,
                email,
                password : hashedPass

            })
            await newRetailer.save()
            console.log('saved');
            }
        } catch (error) {

        }

}