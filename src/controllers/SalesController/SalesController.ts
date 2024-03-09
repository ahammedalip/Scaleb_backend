import express, { Request, Response } from "express";
import retailerAdmin from "../../models/retailerAdmin";
import retailerSales from "../../models/RetailerSales";
import exp from "constants";
import productionAdmin from "../../models/ProductionAdmin";
import order from "../../models/order";
import { Document, Model, model, Schema, Types } from 'mongoose';




export const getAvailableProduction = async (req: Request, res: Response) => {
    const id = req.id;

    try {
        const findAdmin = await retailerSales.findById(id)
        console.log(findAdmin?.retailerAdminId);
        const adminId = findAdmin?.retailerAdminId;

        const findProd = await retailerAdmin.findOne(
            { _id: adminId }
        ).populate('connectedProduction'); // Specify the path to populate

        const connected = findProd?.connectedProduction

        return res.status(200).json({ success: true, message: 'user list fetched successfully', availableProduction: connected })

    } catch (error) {
        console.log('error at fetching available production unit');
        return res.status(500).json({ success: false, message: 'Error while fetching data' })
    }

}

export const viewIndividualprofile = async (req: Request, res: Response) => {
    const productionId = req.query.id
    console.log('production id', productionId);
    try {
        const production = await productionAdmin.findById(productionId)

        if (production?.isBlocked || !production?.isVerified) {
            return res.status(401).json({ success: false, message: 'User is blocked' })
        }
        return res.status(200).json({ success: true, message: 'user profile fetched successfully', userDetails: production })
    } catch (error) {
        console.log('error at fetching individual profile', error);
        res.status(500).json({ success: false, message: 'error while user profile fetching' })
    }
}

export const createOrder = async (req: Request, res: Response) => {
    const id = req.id;
    // console.log('sales id ', id);
    // console.log('in createorder------', req.body);
    const { productionId, selectedProduct, scheduledDate, quantity, urls, description } = req.body
    console.log('production id', productionId, 'selectedproduct', selectedProduct, 'scheduled date', scheduledDate, 'quantity', quantity, 'urls', urls, 'description', description);
    try {
        const date = new Date(scheduledDate);
        const validProduction = await productionAdmin.findById(productionId)
        if (validProduction?.isBlocked) {
            return res.status(403).json({ success: false, message: 'Production unit is blocked' })
        }

        const validSalesExec = await retailerSales.findById(id)
        const retailerAdmin = validSalesExec?.retailerAdminId


        const newOrder = new order({
            productionId,
            item:selectedProduct,
            salesExecId: id,
            retailerId: retailerAdmin,
            scheduledDate: date,
            imageURL: urls,
            quantity: quantity,
            status: "Pending",
            description: description,
            accepted: 'No'
        })
        await newOrder.save();
        res.status(200).json({ success: true, message: 'order created successfully' })

    } catch (error) {
        console.log('error at creating order', error);
        res.status(500).json({ success: false, message: 'Error while creating order' })
    }

}

export const fetchOrder = async (req: Request, res: Response) => {

    const id = req.id
    try {
        const getOrder = await order.find({
            salesExecId: id
        }).populate('productionId')
     console.log('orders are', getOrder);

       
        res.status(200).json({ success: true, message: 'order fetched successfully', orders:getOrder})

    } catch (error) {
        console.log('error at fetching order of sales executive', error);
        res.status(500).json({ success: false, message: 'error while fetching orders' })
    }
}

export const editOrderRequest = async (req:Request, res:Response) => {
 const id = req.id
 console.log('from req.body',req.body);
 try{


 }catch(error){

 }
}