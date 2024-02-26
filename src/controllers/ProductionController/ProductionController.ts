import { Request, Response } from 'express'
import productionAdmin from '../../models/ProductionAdmin';



export const getProfile = async (req: Request, res: Response) => {

    const userRole = req.role;
    const userId = req.id;

    try {
        const verifyUser = await productionAdmin.findById(userId)
        if(!verifyUser){
            return res.status(401).json({success:false, message: 'UnAuthorized user'})
        }
        // console.log(verifyUser);
        res.status(200).json({success:true, message:'user details fetched successfully', userDetails: verifyUser})
    } catch (error) {
        
    }

}

export const addItem = async (req:Request,res:Response) =>{
    const userId = req.id;
    const {name} = req.body
    console.log(name, 'id',userId);

    try {
        const verifyUser = await productionAdmin.findById(userId)
        if(!verifyUser){
            return res.status(401).json({success:false, message:'Unauthorized user'})
        }
        const updateResult = await productionAdmin.updateOne(
            {_id:userId},
            {$push:{availableItems:name}}
        )

        if(updateResult.acknowledged == false){
            return res.status(400).json({ success: false, message: 'Failed to add item' });
        }

        const updatedUser = await productionAdmin.findById(userId);
    
        return res.json({ success: true, userDetails:updatedUser });

    } catch (error) {
        
    }

}







