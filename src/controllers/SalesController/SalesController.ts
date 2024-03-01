import express, { Request, Response } from "express";
import retailerAdmin from "../../models/retailerAdmin";
import retailerSales from "../../models/RetailerSales";



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
        return res.status(200).json({success: true, message: 'user list fetched successfully', availableProduction:connected})
        
    } catch (error) {
        
    }
    // return res.status(200)
}