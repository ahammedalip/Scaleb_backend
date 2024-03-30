import { Request, Response } from 'express'
import productionAdmin from '../../models/ProductionAdmin';
import retailerAdmin from '../../models/RetailerAdmin';
import order from '../../models/Order';
import retailerSales from '../../models/RetailerSales';
import reviews from '../../models/Reviews';
import mongoose from 'mongoose';



export const fetchOrdersAll = async (req: Request, res: Response) => {
    const id = req.id
    const filter = req.query.filter

    const pageSize: number = 2;

    if (filter == 'Edit_request') {
        console.log(filter);
        try {
            const { page = 1 } = req.query as { page?: number }
            const totalOrders = await order.countDocuments({
                productionId: id,
                accepted: "No"

            })
            const totalpages = Math.ceil(totalOrders / pageSize)
            const orders = await order.find({
                productionId: id,
                updateRequest: 'Requested'
            }).skip((page - 1) * pageSize)
                .limit(Number(pageSize))
                .populate('retailerId')
                .populate('salesExecId')

            console.log(orders);
            return res.status(200).json({ success: true, message: 'order list fetched successfully', orders, totalOrders, totalPages: totalpages })
        } catch (error) {
            console.log('error while fetching update request')
            res.status(500)
        }
    }

    if (filter == 'New_Requests') {
        console.log(filter);

        // const skip = (page - 1) * limit;
        try {
            const { page = 1 } = req.query as { page?: number }
            const totalOrders = await order.countDocuments({
                productionId: id,
                accepted: "No"

            })
            const totalpages = Math.ceil(totalOrders / pageSize)
            const orders = await order.find({
                productionId: id,
                accepted: "No"
            }).skip((page - 1) * pageSize)
                .limit(Number(pageSize))
                .populate('retailerId')
                .populate('salesExecId')

            console.log(orders);
            return res.status(200).json({ success: true, message: 'order list fetched successfully', orders, totalOrders, totalPages: totalpages })
        } catch (error) {
            console.log('error while fetching update request')
            res.status(500)
        }
    }
    if (filter == 'Pending') {
        // const skip = (page - 1) * limit;
        console.log(filter);

        try {
            const { page = 1 } = req.query as { page?: number }
            const totalOrders = await order.countDocuments({
                productionId: id,
                accepted: 'Yes',
                status: 'Pending'
            })
            const totalpages = Math.ceil(totalOrders / pageSize)
            const orders = await order.find({
                productionId: id,
                accepted: 'Yes',
                status: 'Pending'
            }).skip((page - 1) * pageSize)
                .limit(Number(pageSize))
                .populate('retailerId')
                .populate('salesExecId')

            console.log(orders);
            return res.status(200).json({ success: true, message: 'order list fetched successfully', orders, totalOrders, totalPages: totalpages })
        } catch (error) {
            console.log('error while fetching update request')
            res.status(500)
        }
    }
    if (filter == 'Completed') {
        console.log(filter);

        // const skip = (page - 1) * limit;
        try {
            const { page = 1 } = req.query as { page?: number }
            const totalOrders = await order.countDocuments({
                productionId: id,
                status: 'Completed'
            })
            const totalpages = Math.ceil(totalOrders / pageSize)

            const orders = await order.find({
                productionId: id,
                status: 'Completed'
            }).skip((page - 1) * pageSize)
                .limit(Number(pageSize))
                .populate('retailerId')
                .populate('salesExecId')

            console.log(orders);
            return res.status(200).json({ success: true, message: 'order list fetched successfully', orders, totalOrders, totalPages: totalpages })
        } catch (error) {
            console.log('error while fetching update request')
            res.status(500)
        }
    } else if (filter == "All") {
        console.log(filter);

        try {
            const { page = 1 } = req.query as { page?: number }
            const totalOrders = await order.countDocuments({
                productionId: id
            })

            const totalpages = Math.ceil(totalOrders / pageSize)
            console.log('count documents', totalOrders, 'total pages', totalpages)

            const orders = await order.find({
                productionId: id
            }).skip((page - 1) * pageSize)
                .limit(Number(pageSize))

                .populate('retailerId')
                .populate('salesExecId')

            // console.log(orders);
            return res.status(200).json({ success: true, message: 'order list fetched successfully', orders, totalOrders, totalPages: totalpages })
        } catch (error) {
            console.log('error at fetch order', error);
            return res.status(500).json({ success: false, message: 'error at fetching order ' })
        }
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