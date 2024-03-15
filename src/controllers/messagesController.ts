import { Request,Response } from "express";
import { Messages } from "../models/Messages";
import { Conversation } from "../models/Conversations";


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

    console.log('coming here to get message');
    console.log('query id converstionId',req.query);
 
    try {
       
        const senderId = req.query.sender;
        const recipientId = req.query.recipient;

        // Query to find a conversation that includes both the sender and recipient IDs in its members array
        const conversation = await Conversation.findOne({
            members: { $all: [senderId, recipientId] }
        });

            console.log('conversation id---',conversation._id)
   
        const messages = await Messages.find({
            conversationId: conversation._id
        })    
        console.log('messages of given conversation',messages);
        res.status(200).json({success:true, messages, conversationId: conversation?._id})
    } catch (error) {
        console.log('error at getting messages', error);
        res.status(500).json({success:false, message: 'error while fetching message'})
    }
}


