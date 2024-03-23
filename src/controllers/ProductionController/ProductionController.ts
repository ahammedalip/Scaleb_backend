import { Request, Response } from 'express'
import productionAdmin from '../../models/ProductionAdmin';
import retailerAdmin from '../../models/RetailerAdmin';
import order from '../../models/Order';
import retailerSales from '../../models/RetailerSales';
import reviews from '../../models/Reviews';
import mongoose from 'mongoose';

interface CustomRequest extends Request {
    id: number,
    role: string
}



export const getProfile = async (req: Request, res: Response) => {

    const userRole = req.role;
    const userId = req.id;

    try {
        const verifyUser = await productionAdmin.findById(userId)
        if (!verifyUser) {
            return res.status(401).json({ success: false, message: 'UnAuthorized user' })
        }
        // console.log(verifyUser);
        res.status(200).json({ success: true, message: 'user details fetched successfully', userDetails: verifyUser })
    } catch (error) {
        console.log('error at fetching profile', error);
        return res.status(500).json({ success: false, message: 'Error while fetching profile' })

    }

}

export const addItem = async (req: Request, res: Response) => {
    const userId = req.id;
    const { name } = req.body

    try {
        const verifyUser = await productionAdmin.findById(userId)
        if (!verifyUser) {
            return res.status(401).json({ success: false, message: 'Unauthorized user' })
        }
        const updateResult = await productionAdmin.updateOne(
            { _id: userId },
            { $push: { availableItems: name } }
        )

        if (updateResult.acknowledged == false) {
            return res.status(400).json({ success: false, message: 'Failed to add item' });
        }

        const updatedUser = await productionAdmin.findById(userId);

        return res.json({ success: true, userDetails: updatedUser });

    } catch (error) {
        console.log('error at adding item ', error);
        return res.status(500).json({ success: false, message: 'Error while adding item' })
    }

}

export const fetchRequestedRetailers = async (req: Request, res: Response) => {
    const id = req.id;

    try {
        const fetchUser = await productionAdmin.findById(id).populate('requestedRetailer');

        const notBlockedRetailers: any = fetchUser?.requestedRetailer.filter(retailer => !retailer.isBlocked);

        if (notBlockedRetailers.length > 0) {
            // console.log('Some requested retailers are :', notBlockedRetailers);
            // Handle the case where some retailers are blocked
        } else {
            // console.log('No requested retailers are blocked.');
            // Handle the case where no retailers are blocked
        }
        return res.status(200).json({ success: true, message: 'fetched users', userDetails: notBlockedRetailers })
    } catch (error) {

    }
}

export const acceptReq = async (req: Request, res: Response) => {
    const id = req.id;
    const retailId = req.body.id


    try {
        const verifyProduction = await productionAdmin.findById(id)

        if (verifyProduction?.isBlocked) {
            return res.status(403).json({ success: false, message: "unauthorized user" })
        }
        const checkConnectionProd = await productionAdmin.findOne(
            {
                $and: [
                    { _id: id },
                    { connectedRetailer: { $in: [retailId] } }
                ]
            }
        )

        const checkConnectionRet = await retailerAdmin.findOne(
            {
                $and: [
                    { _id: retailId },
                    { connectedProduction: { $in: [id] } }
                ]
            }
        )

        if (checkConnectionProd || checkConnectionRet) {

            await productionAdmin.findByIdAndUpdate(
                id,
                { $pull: { requestedRetailer: retailId } },
                { new: true }
            );

            return res.status(200).json({ success: true, message: 'already connected' })
        } else {
            const updateProd = await productionAdmin.findByIdAndUpdate(
                id,
                { $push: { connectedRetailer: retailId } },
                { new: true });

            const updateRet = await retailerAdmin.findByIdAndUpdate(
                retailId,
                { $push: { connectedProduction: id } },
                { new: true }
            )

            await productionAdmin.findByIdAndUpdate(
                id,
                { $pull: { requestedRetailer: retailId } },
                { new: true }
            );


            return res.status(200).json({ success: true, message: 'User connected' })
        }


    } catch (error) {
        console.error('Error processing connection request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const rejectReq = async (req: Request, res: Response) => {
    const id = req.id
    const retailerId = req.query.id

    console.log('profile id is========', retailerId)
    try {

        const deleteReq = await productionAdmin.findByIdAndUpdate(
            id,
            { $pull: { requestedRetailer: retailerId } },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'Connection Request rejected' })

    } catch (error) {
        console.error('Error rejecting connection request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


export const fetchOrders = async (req: Request, res: Response) => {
    const id = req.id
    try {
        const orders = await order.find({
            productionId: id
        }).populate('retailerId').populate('salesExecId')
        // console.log(orders);
        return res.status(200).json({ success: true, message: 'order list fetched successfully', orders })
    } catch (error) {
        console.log('error at fetch order', error);
        return res.status(500).json({ success: false, message: 'error at fetching order ' })
    }

}

export const acceptOrder = async (req: Request, res: Response) => {
    const id = req.id

    const orderId = req.body.orderId

    try {
        const existingOrder = await order.findById(orderId)

        if (!existingOrder) {
            return res.status(404).json({ success: false, message: 'Order not found!' })
        }

        existingOrder.accepted = 'Yes'

        await existingOrder.save()

        return res.status(200).json({ success: true, message: 'Order accepted' })

    } catch (error) {
        console.log('error at accepting order', error);
        return res.status(500).json({ success: false, message: 'error at accepting order ' })
    }
}


export const rejectOrder = async (req: Request, res: Response) => {
    const id = req.id
    const orderId = req.body.orderId
    // console.log('coming to reject order', id, orderId);
    try {
        const existingOrder = await order.findById(orderId)

        if (!existingOrder) {
            return res.status(404).json({ success: false, message: 'Order not found!' })
        }

        existingOrder.accepted = 'Rejected'

        await existingOrder.save()

        return res.status(200).json({ success: true, message: 'Order rejected' })
    } catch (error) {
        console.log('error at rejecting order', error);
        return res.status(500).json({ success: false, message: 'error at rejecting order ' })
    }
}

export const availableSales = async (req: Request, res: Response) => {
    const id = req.id;

    try {
        const productionAdminDoc = await productionAdmin.findById(id).populate('connectedRetailer')
        const connectedRetailerId = productionAdminDoc?.connectedRetailer.map(retailer => retailer._id)

        const salesExecutive = await retailerSales.find({
            retailerAdminId: { $in: connectedRetailerId },
            isBlocked: false
        })
        return res.status(200).json({ success: true, message: 'Sales executives list fetched successfully', salesExecutive })
    } catch (error) {
        console.log('Error at fetching sales executives', error);
        return res.status(500).json({ success: false, message: 'Error at fetching sales executives' })
    }
}


export const getSalesProfile = async (req: Request, res: Response) => {
    const salesId = req.body.salesId

    try {
        const salesExecutive = await retailerSales.findById(salesId);

        if (salesExecutive?.isBlocked) {
            return res.status(403).json({ success: false, message: 'user is blocked' })
        }
        res.status(200).json({ success: true, salesExecutive })
    } catch (error) {
        console.log('Error at fetching sales executives', error);
        return res.status(500).json({ success: false, message: 'Error at fetching sales executives' })
    }
}


export const getConnRetailersList = async (req: Request, res: Response) => {
    const id = req.query.id
    try {
        const connectedRetailer = await productionAdmin.findById(id).populate('connectedRetailer')
        const connected = connectedRetailer?.connectedRetailer
        // console.log(connected);
        res.status(200).json({ success: true, message: 'fetched successfully', connected })
    } catch (error) {
        console.log('Error while fetching connected retailers', error);
        return res.status(500).json({ success: false, message: 'Error at  while fetching connected retailers' })
    }
}

export const getAvailRetailList = async (req: Request, res: Response) => {
    const id = req.query.id
    // console.log('id for get avail req is ', id)
    try {
        const production = await productionAdmin.findById(id);

        const connectedRetailer = production?.connectedRetailer;

        const availableRetailer = await retailerAdmin.find({
            isBlocked: false,
            isVerified: true,
            _id: { $nin: connectedRetailer }
        });
        console.log('available retailer', availableRetailer)

        res.status(200).json({ success: true, availableRetailer })
    } catch (error) {
        console.log('error while fetching available retailers', error)
        res.status(500).json({ success: false, message: 'Error while fetching available retailers' })
    }
}


export const getRetailerProfile = async (req: Request, res: Response) => {
    const id = req.query.id
    try {
        const retailerProfile = await retailerAdmin.findById(id)
        if (retailerProfile?.isBlocked) {
            return res.status(403).json({ success: false, message: 'user is blocked' })
        }
        // Calculate the average rating
        const averageRating = await reviews.aggregate([
            {
                $match: {
                    'reviewee.id': mongoose.Types.ObjectId.createFromHexString(id as string),
                    'reviewee.type': 'retailer'
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        // console.log('adkfljaksdljfas', averageRating)

        let averageToFive = 0

        if (averageRating.length > 0) {
            averageToFive = Math.ceil((averageRating[0].averageRating / 2) * 2) / 2;
        }

        // console.log('average to 555', averageToFive)

        res.status(200).json({ success: true, retailerProfile, message: 'user profile fetched successfully' , rating: averageToFive})
    } catch (error) {
        console.log('ERror while fetching retailer individual profile')
        res.status(500).json({ success: false, message: 'error while fetching details' })
    }
}

export const sendConnectionRequest = async (req: Request, res: Response) => {
    // console.log('data from tne sgkdjkd body', req.body)
    const productionId = req.body.productionId
    const retailerId = req.body.retailId

    try {
        const validRetailer = await retailerAdmin.findById(retailerId)
        if (validRetailer?.isBlocked || !validRetailer?.isVerified) {
            return res.status(403).json({ success: false, message: 'user is blocked' })
        }

        const checkReq = await retailerAdmin.findOne({
            $and: [
                { _id: retailerId },
                { requestedProduction: { $in: [productionId] } }
            ]
        })
        if (checkReq) {
            return res.status(200).json({ success: true, message: 'Already requested' })
        } else {
            // const addReqProd = await productionAdmin.findByIdAndUpdate(productionId, { $push: { requestedRetailer: retailerId } }, { new: true })
            // console.log('add req production');
            const addReqRet = await retailerAdmin.findByIdAndUpdate(retailerId, { $push: { requestedProduction: productionId } }, { new: true })

            if (addReqRet) {
                return res.status(200).json({ success: true, message: 'Request send Successfully' });
            } else {
                return res.status(404).json({ success: false, message: 'Retailer not found' });
            }
        }
    } catch (error) {
        console.error('Error processing connection request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

}