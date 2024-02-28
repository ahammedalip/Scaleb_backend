import { Request, Response } from 'express'
import productionAdmin from '../../models/ProductionAdmin';
import retailerAdmin from '../../models/retailerAdmin';

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
    console.log(name, 'id', userId);

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
        // if(fetchUser?.requestedRetailer)
        console.log(fetchUser?.requestedRetailer);
        const notBlockedRetailers: any = fetchUser?.requestedRetailer.filter(retailer => !retailer.isBlocked);

        if (notBlockedRetailers.length > 0) {
            console.log('Some requested retailers are :', notBlockedRetailers);
            // Handle the case where some retailers are blocked
        } else {
            console.log('No requested retailers are blocked.');
            // Handle the case where no retailers are blocked
        }
        return res.status(200).json({ success: true, message: 'fetched users', userDetails: notBlockedRetailers })
    } catch (error) {

    }
}

export const acceptReq = async (req: Request, res: Response) => {
    const id = req.id;
    const retailId = req.body.id
    console.log(id, retailId);

    try {
        const verifyProduction = await productionAdmin.findById(id)
        
        if(verifyProduction?.isBlocked){
            return res.status(403).json({success:false, message:"unauthorized user"})
        }
        const checkConnectionProd = await productionAdmin.findOne(
            {$and:[
                {_id:id},
                {connectedRetailer:{$in:[retailId]}}
            ]}
        )

        const checkConnectionRet = await retailerAdmin.findOne(
            {$and:[
                {_id:retailId},
                {connectedProduction:{$in:[id]}}
            ]}
        )

        if(checkConnectionProd||checkConnectionRet){
            return res.status(200).json({success:true, message: 'already connected'})
        }else{
            const updateProd = await productionAdmin.findByIdAndUpdate(
                id,
                {$push:{connectedRetailer:retailId}},
                {new:true});
    
            const updateRet = await retailerAdmin.findByIdAndUpdate(
                retailId,
                {$push:{connectedProduction:id}},
                {new: true}
            )
            return res.status(200).json({success:true, message: 'User connected'})
        }
        
        
    } catch (error) {
        console.error('Error processing connection request:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}







