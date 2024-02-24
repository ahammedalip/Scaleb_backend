import superAdmin from "../../models/superAdmin";
import { NextFunction, Request, Response } from 'express';
import { errorhandler } from "../../utils/errorhandler";
import jwt from 'jsonwebtoken'
import retailerAdmin from "../../models/retailerAdmin";
import productionAdmin from "../../models/ProductionAdmin";
import { rmSync } from "fs";

interface SuperAdmin {
    username: string;
    password: string;

}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password: reqPassword } = req.body;

    try {
        const validUser = await superAdmin.findOne({ username })
        console.log('user found', validUser)
        if (!validUser) {
            // If user is not found, call the error handler and pass the error to next
            const error = errorhandler(401, "User not found");
            return res.status(error.StatusCode).json({ success: false, message: error.message });
        }
        if (validUser && validUser.password && validUser.password !== reqPassword) {
            const error = errorhandler(401, "Wrong credentials");
            return res.status(error.StatusCode).json({ success: false, message: error.message });
        }
        validUser.password = "";
        console.log(validUser);

        const token = jwt.sign({ id: validUser._id.toString(), role: 'SuperAdmin' }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

        const expiry: Date = new Date(Date.now() + 3600000)
        res.cookie('admin_token', token, { expires: expiry, secure: false }).status(200).json({ user: validUser, token, success: true, message: 'user validated' });
    }
    catch (err) {
        console.log('Error at superAdmin signup', err);

        const error = errorhandler(500, "Internal Server Error");
        res.status(error.StatusCode).json({ success: false, message: error.message });
    }
}


export const getRetailerList = async (req: Request, res: Response) => {
    const id = req.query.id

    try {
        const verifyAdmin = await superAdmin.findById(id)
        if (!verifyAdmin) {
            return res.status(403).json({ success: false, message: 'please login and try again' })
        }

        const retailersList = await retailerAdmin.find({ isVerified: true })
        console.log('list', retailersList);

        res.status(200).json({ success: true, message: 'Retailer list fetched successfully', userlist: retailersList })
    } catch (error) {
        console.log('error at fetching retailer list', error);
        res.status(500).json({ success: false, message: 'Error at fetching retailer list' })
    }
}

export const getProductionList = async (req: Request, res: Response) => {
    const id = req.query.id
    console.log(id);

    try {
        const verifyAdmin = await superAdmin.findById(id)
        if (!verifyAdmin) {
            return res.status(403).json({ success: false, message: "Please login and try again" })
        }
        const productionList = await productionAdmin.find({ isVerified: true })
        res.status(200).json({ success: true, message: 'Production list fetched successfully', userlist: productionList })
    } catch (error) {
        console.log('Error at fetching production list=>', error);
        res.status(500).json({ success: false, message: 'Error at fetching production list' })
    }
}

export const blockUser = async (req: Request, res: Response) => {
    const { role, id } = req.query
    console.log(role, id);
    console.log('cp,omm');
    if (role == 'production') {
        try {
            const validUser = await productionAdmin.findById(id)
            if (!validUser) {
                return res.status(404).json({ success: false, message: 'User not found' })
            }
            const isBlocked = validUser.isBlocked;

            const updateStatus = await productionAdmin.updateOne(
                { _id: id },
                { $set: { isBlocked: !isBlocked } })
            if (!updateStatus) {
                return res.status(500).json({ success: false, message: 'Error while blocking' })
            }
            const productionList = await productionAdmin.find({ isVerified: true })
            return res.status(200).json({ success: true, message: 'User blocked successfully', userlist:productionList})
        } catch (error) {
            console.log('error at block production or retailer user -->', error);
            res.status(500).json({ success: true, message: 'Error at Blocking user' })
        }
    }else if(role == 'retailer'){
        try {
            const validUser = await retailerAdmin.findById(id)
            if (!validUser) {
                return res.status(404).json({ success: false, message: 'User not found' })
            }
            const isBlocked = validUser.isBlocked;

            const updateStatus = await retailerAdmin.updateOne(
                { _id: id },
                { $set: { isBlocked: !isBlocked } })
            if (!updateStatus) {
                return res.status(500).json({ success: false, message: 'Error while blocking' })
            }
            const productionList = await retailerAdmin.find({ isVerified: true })
            return res.status(200).json({ success: true, message: 'User blocked successfully', userlist:productionList})
        } catch (error) {
            console.log('error at block production or retailer user -->', error);
            res.status(500).json({ success: true, message: 'Error at Blocking user' })
        }
    }
}