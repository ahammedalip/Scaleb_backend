import { NextFunction, Request, Response } from "express"
import retailerAdmin from "../models/retailerAdmin";
import bcryptjs from 'bcryptjs'



export const retailerSignUp = async (req: Request, res: Response, next:NextFunction) => {
    const {retailerName, email, password,} = req.body
    console.log(req.body);
    try{
        const existingRetailer = await retailerAdmin.findOne({retailerName})
        const existingEmail = await retailerAdmin.findOne({email})
        if(existingRetailer){
            res.status(400).json({success:false, message: 'Retailer name already exists'})
        }
        if(existingEmail){
            res.status(400).json({success:false, message: 'Email already exists'})
        }
        const hashedPass = bcryptjs.hashSync(password,2)
        const newRetailer = new retailerAdmin({
            retailerName,
            email,
            password: hashedPass
        })

        const newUser = await newRetailer.save()
        res.status(201).json({success: true, message: 'User created successfully'})
    }catch(err){
        console.log('error at retailer signup', err)
        if(err.code===11000){
            const keyValue= err.keyValue
            // console.log(err.keyValue);
            res.status(409).json({success:false, message: `${keyValue} already exists`})
        }
        
    }

}