import { NextFunction, Request, Response } from "express"
import session from 'express-session'
import retailerAdmin from "../models/retailerAdminAuth";
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer'
import jwt, { JsonWebTokenError } from "jsonwebtoken";



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
        const generatedOTP: number = Math.floor(100000 + Math.random() * 900000);

        const hashedPass: string = bcryptjs.hashSync(password, 2);
        const newRetailer = new retailerAdmin({
            retailerName,
            email,
            password: hashedPass,
            otpCode: generatedOTP
        })

        await newRetailer.save()

        console.log('generated OTP is ', generatedOTP);
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'ahmd.work12@gmail.com',
                pass: 'awbs lrfg gwgv zqvg'
            }
        })


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
    } catch (err: any) {
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
    const { retailerName, email, password } = formData;

    try {
        const verifyEmail = await retailerAdmin.findOne({ email: email });
        console.log('code from mongo', verifyEmail?.otpCode);
        console.log('code from frontend', otp);
        const verifyOTP = verifyEmail?.otpCode == otp
        console.log('verify email', verifyEmail, 'verify otp', verifyOTP);
        if (!verifyOTP || !verifyEmail) {
            res.status(401).json({ success: false, message: 'OTP entered is incorrect. Please try again.' })
        }
        if (verifyOTP) {
            retailerAdmin.updateOne(
                { email }, { $set: { isVerified: true } }
            )
            return res.status(200).json({ success: true, message: 'OTP verified successfully.' });
        }
    } catch (error) {
        console.error("Error at otp verification", error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }

}

export const retailLogin = async (req: Request, res: Response) => {
    const { retailerName, password } = req.body

    console.log(retailerName, password);


    try {
        const validUser = await retailerAdmin.findOne({ retailerName });
        const hashedPass = bcryptjs.compareSync(password, validUser?.password)
        // console.log('hashed pass out', hashedPass);
        if (!validUser) {
            res.status(401).json({ success: false, message: 'Enter valid credentials' })
        }
        if (!hashedPass) {
            res.status(401).json({ success: false, message: 'Password is wrong' })
        }

        validUser.password = "";
        const token = jwt.sign({ id: validUser?._id.toString(), role: 'retailerAdmin' }, process.env.JWT_SECRET || '', { expiresIn: '1h' })
        const expiry:Date = new Date(Date.now()+3600000)
        res.cookie('access_token1', token, {httpOnly: true,expires: expiry, secure:false}).status(200).json({user: validUser, token, success: true, message: 'User validated'});
    } catch (error) {
        console.log('Error at retailAdmin signup', error);
        res.status(500).json({success: false, message:'Internal server Error'})
    }
}