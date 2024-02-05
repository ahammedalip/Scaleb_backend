import { NextFunction, Request, Response } from "express"
import session from 'express-session'
import retailerAdmin from "../models/retailerAdmin";
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer'



export const retailerSignUp = async (req: Request, res: Response, next: NextFunction) => {
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
        const mailOptions = {
            from: 'ahmd.work12@gmail.com',
            to: req.body.email, // User's email
            subject: 'OTP Verification',
            text: `Your OTP for verification of Scale.b is  : ${generatedOTP}. 
     Do not share the OTP with anyone.
     For further details and complaints visit info.goshoppy.com`
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
        
        // const hashedPass = bcryptjs.hashSync(password,2)
        // const newRetailer = new retailerAdmin({
        //     retailerName,
        //     email,
        //     password: hashedPass
        // })
        // const newUser = await newRetailer.save()
        // res.status(201).json({ success: true, message: 'User created successfully' })
    } catch (err) {
        console.log('error at retailer signup', err)
        if (err.code === 11000) {
            const keyValue = err.keyValue
            // console.log(err.keyValue);
            res.status(409).json({ success: false, message: `${keyValue} already exists` })
        }

    }

}