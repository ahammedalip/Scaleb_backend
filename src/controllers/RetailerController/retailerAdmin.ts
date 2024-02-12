import exp from "constants";
import { Request, Response } from "express";
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer';
import retailerAdmin from "../../models/retailerAdmin";
import retailerSales from "../../models/RetailerSales";



export const addSalesExecutive = async (req: Request, res: Response) => {

    const { data, id } = req.body
    const { username, password, email } = data

    try {
        console.log('hi');
        const validAdmin = await retailerAdmin.findById(id)
        if (validAdmin?.isBlocked || !validAdmin?.isVerified) {
            return res.status(403).json({ success: false, message: 'Please login again' })
        }
        const modUsername = username + '@' + validAdmin.retailerName;

        const existingUsername = await retailerSales.findOne({ username })
        const existingEmail = await retailerSales.findOne({ email });

        if (existingEmail || existingUsername) {
            return res.status(409).json({ success: false, message: "Email or username already exists" })
        }
        console.log(modUsername);
        const hashedPass = bcryptjs.hashSync(password, 2)


        const newSalesExec = new retailerSales({
            username: modUsername,
            email,
            password: hashedPass,
            retailerAdminId: id
        })

        newSalesExec.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'ahmd.work12@gmail.com',
                pass: 'awbs lrfg gwgv zqvg'
            }
        })

        const mailOptions = {
            from: 'ahmd.work12@gmail.com',
            to: email, // User's email
            subject: 'Username and password',
            text: `Congratulations You are registered!!!.
        please use the below given Username and Password for logging into scale.b
        Username: ${modUsername},
        Password: ${password}.
        
        For logging in please visit http://localhost:5173/retail/login`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(400).json({ success: false, message: "Error at sending mail" })
            } else {
                console.log('Email sent: ' + info.response);
                res.status(250).json({ success: true, message: 'User registered and email sent successfully' })
            }
        });

    } catch (error) {
        console.log('error at addSalesExecutive', error);
        res.status(400).json({success:false, message: "Error while adding sales executive"})
    }
}


export const getSalesList = async (req: Request, res: Response)=>{
    const id = req.query.id;
    
    try {
        const validAdmin = await retailerAdmin.findById(id)
        if(!validAdmin){
            return res.status(403).json({success: true, message: "Please login"})
        }
        const salesExeclist = await retailerSales.find({retailerAdminId:id})




    res.status(200).json({ success: true,message: 'list fetched successfully', salesExeclist })
        
    } catch (error) {
        console.log('error at sales exec list', error);
        res.status(400).json({success:false, message: "Error while fetching data"})
    }
}