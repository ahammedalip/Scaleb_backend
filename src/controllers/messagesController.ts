import { Request,Response } from "express";
import { Messages } from "../models/Messages";


export const addMessage = async (req: Request, res: Response)=>{
    const newMessage = new Messages(req.body)

    try {
        const savedMessage = await newMessage.save()
        res.status(200).json({success:true, savedMessage})
    } catch (error) {
        console.log('error at adding messages', error);
        res.status(500).json({success:false, message: 'error while adding message'})
    }
}

export const getMessage = async (req: Request, res: Response) => {
 
    try {
        const messages = await Messages.find({
            conversationId: req.query.conversationId
        })    
        console.log(messages);
        res.status(200).json({success:true, messages})
    } catch (error) {
        console.log('error at getting messages', error);
        res.status(500).json({success:false, message: 'error while fetching message'})
    }
}
