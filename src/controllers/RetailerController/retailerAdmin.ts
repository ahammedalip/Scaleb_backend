import exp from "constants";
import { Request, Response } from "express";
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer';
import retailerAdmin from "../../models/retailerAdmin";
import retailerSales from "../../models/RetailerSales";
import productionAdmin from "../../models/ProductionAdmin";

interface CustomRequest extends Request {
    id: number,
    role: string
}


export const addSalesExecutive = async (req: Request, res: Response) => {

    const { data, id } = req.body
    const { username, password, email } = data

    try {
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
        res.status(500).json({ success: false, message: "Error while adding sales executive" })
    }
}


export const getSalesList = async (req: Request, res: Response) => {
    const id = req.query.id;

    try {
        const validAdmin = await retailerAdmin.findById(id)
        if (!validAdmin) {
            return res.status(403).json({ success: false, message: "Please login" })
        }
        const salesExeclist = await retailerSales.find({ retailerAdminId: id })




        res.status(200).json({ success: true, message: 'list fetched successfully', salesExeclist })

    } catch (error) {
        console.log('error at sales exec list', error);
        res.status(500).json({ success: false, message: "Error while fetching data" })
    }
}

export const blockSalesExec = async (req: Request, res: Response) => {

    const id = req.query.id
    console.log('id from query is ', id);

    try {
        const validUser = await retailerSales.findById(id)
        if (!validUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const isBlocked = validUser.isBlocked;
        const updateStatus = await retailerSales.updateOne(
            { _id: id },
            { $set: { isBlocked: !isBlocked } }
        )

        if (!updateStatus) {
            return res.status(500).json({ success: false, message: 'Error while blocking' })
        }
        if (updateStatus) {
            console.log('updated', updateStatus);
        }
        const salesExeclist = await retailerSales.find()
        return res.status(200).json({ success: true, message: 'User blocked/unblocked successfully', userlist: salesExeclist })

    } catch (error) {
        console.log('error in blocking sales exec', error);
        res.status(500).json({ success: false, message: 'error while blocking user' })
    }
}

export const profile = async (req: Request, res: Response) => {
    const userRole = req.role;
    const userId = req.id;
    console.log('coming here');
    try {
        const verifyUser = await retailerAdmin.findById(userId)
        if (!verifyUser) {
            return res.status(401).json({ success: false, message: 'UnAuthorized user' })
        }

        res.status(200).json({ success: true, message: 'user details fetched successfully', userDetails: verifyUser })
    } catch (error) {
        console.log('error at get profile');
        return res.status(500).json({ success: false, message: 'Error while fetchin profile' })
    }
}





export const avialableProd = async (req: Request, res: Response) => {
    console.log('coming here');
    const id = req.id

    try {
        const availableProduction = await productionAdmin.find({
            isBlocked: false,
            isVerified: true,
            _id: { $nin: retailerAdmin.connectedProduction } // Exclude IDs present in connectedProduction
        });

        console.log(availableProduction);
        return res.status(200).json({ success: true, message: 'fetched available production units', availableProduction })


    } catch (error) {
        console.log('Error while fetching available production list profile', error);
        return res.status(500).json({ success: false, message: 'Error while fetching available production list profile' })
    }
}

export const showProductionprofile = async (req: Request, res: Response) => {
    const { id } = req.query
    console.log('id is--', id);

    try {
        const isvalidUser = await productionAdmin.findById(id)

        if (!isvalidUser) {
            return res.status(401).json({ success: false, message: 'Unauthorized user' })
        }
        if (isvalidUser.isBlocked || !isvalidUser.isVerified) {
            return res.status(403).json({ success: false, message: 'User is blocked' })
        }
        return res.status(200).json({ success: true, message: 'user details fetched successfully', userDetails: isvalidUser })
    } catch (error) {
        console.log('error at showproductionprofile', error);
        return res.status(500).json({ success: false, message: 'error file fetching profile details' })
    }
}

export const sendConnectionRequest = async (req: Request, res: Response) => {
    const id = req.id;
    const prodId = req.body.prodId;
    console.log('id is', id);
    console.log('prod id ', prodId);

    try {
        const validProduction = await productionAdmin.findById(prodId);
        if (validProduction?.isBlocked || !validProduction?.isVerified) {
            return res.status(403).json({ success: false, message: 'User is blocked' });
        }
        const checkReq = await retailerAdmin.findOne(
            {
                $and: [
                    { _id: id },
                    { requestedProduction: { $in: [prodId] } }
                ]
            }
        )
        if (checkReq) {
            return res.status(200).json({ success: true, message: 'already requested' })
        } else {
            const addReqRet = await retailerAdmin.findByIdAndUpdate(id, { $push: { requestedProduction: prodId } }, { new: true });
            console.log('mongo update', addReqRet);
            const addReqProd = await productionAdmin.findByIdAndUpdate(prodId, { $push: { requestedRetailer: id } }, { new: true })
            if (addReqRet && addReqProd) {
                return res.status(200).json({ success: true, message: 'requested' });
            } else {
                return res.status(404).json({ success: false, message: 'Retailer not found' });
            }
        }
        
    } catch (error) {
        console.error('Error processing connection request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
