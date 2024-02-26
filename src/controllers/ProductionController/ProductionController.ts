import { Request, Response } from 'express'
import productionAdmin from '../../models/ProductionAdmin';



export const getProfile = async (req: Request, res: Response) => {
    // console.log('herllo her');

    const userRole = req.role;
    const userId = req.id;

    try {
        const verifyUser = await productionAdmin.findById(userId)
        if(!verifyUser){
            return res.status(401).json({success:false, message: 'UnAuthorized user'})
        }
        console.log(verifyUser);
        res.status(200).json({success:true, message:'user details fetched successfully', userDetails: verifyUser})
    } catch (error) {
        
    }

}







