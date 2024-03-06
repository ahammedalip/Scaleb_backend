import express, { Request, Response } from "express";
import retailerAdmin from "../../models/retailerAdmin";
import retailerSales from "../../models/RetailerSales";
import exp from "constants";
import productionAdmin from "../../models/ProductionAdmin";




export const getAvailableProduction = async (req: Request, res: Response) => {
    console.log('hello');
    const id = req.id;

    try {
        const findAdmin = await retailerSales.findById(id)
        console.log(findAdmin?.retailerAdminId);
        const adminId = findAdmin?.retailerAdminId;

        const findProd = await retailerAdmin.findOne(
            {_id: adminId}
        ).populate('connectedProduction'); // Specify the path to populate

        const connected = findProd?.connectedProduction
        console.log('connected and available',connected);
        return res.status(200).json({success: true, message: 'user list fetched successfully', availableProduction:connected})
        
    } catch (error) {
        console.log('error at fetching available production unit');
        return res.status(500).json({success:false, message: 'Error while fetching data'})
    }
    
}

export const viewIndividualprofile = async(req:Request, res: Response)=>{
    const productionId = req.query.id
    console.log('production id',productionId);
    try {
        const production = await productionAdmin.findById(productionId)

        if(production?.isBlocked || !production?.isVerified){
            return res.status(401).json({success: false, message: 'User is blocked'})
        }
        return res.status(200).json({success:true, message: 'user profile fetched successfully', userDetails:production})
    } catch (error) {
        console.log('error at fetching individual profile', error);
        res.status(500).json({success:false, message: 'error while user profile fetching'})
    }
}

export const createOrder = async (req:Request, res:Response) =>{
    const id = req.id;
    console.log('sales id ', id);
    console.log('in createorder------',req.body);
    try {
        const validSales = await retailerSales.
    } catch (error) {
        
    }
    res.status(200).json({success:true})
}