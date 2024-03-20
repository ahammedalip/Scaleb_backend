import express, { Request, Response } from 'express'
import { Messages } from '../models/Messages';
import { Conversation } from '../models/Conversations';



export const conversation = async(req:Request, res:Response) =>{
    try {
        const existingConversation = await Conversation.find({
            members: {$all:[req.body.senderId, req.body.recipientId]}
        })

        if(existingConversation.length>0){
            return res.status(200).json({success: true, existing: 'true' })
        }
        const newConversation = new Conversation ({
            members : [req.body.senderId, req.body.recipientId]
        })

        const savedConversation = await newConversation.save()
        res.status(200).json({success:true, savedConversation})
    } catch (error) {
        console.log('error at creating conversation', error);
        res.status(500).json({success:false, message: 'Error while creating conversation'})
    }
}

export const getConversation = async(req:Request, res:Response) =>{
    try {
        const conversation = await Conversation.find({
            members:{$in: [req.params.userId]}
        })
        // console.log(conversation);
        res.status(200).json({success: true, conversation})
    } catch (error) {
        console.log('error at getting conversation', error);
        res.status(500).json({success:false, message: 'error at getting conversation'})
    }
}


// export const sendMessageProduction = async (req: Request, res: Response) => {
//     const senderId = req.id
//     try {
//         const { recipientId, text } = req.body;

//         const message = new Messages({
//             content: text,
//             sender: senderId,
//             receiver: recipientId,
//             senderModel: 'ProductionAdmin', // Adjust based on the sender's model
//             receiverModel: 'RetailerSales', // Adjust based on the receiver's model
//             timestamp: new Date(),
//         });

//         // Save the message to the database
//         await message.save();

//         // Emit the message to the recipient using Socket.io
//         // io.to(recipientId).emit('message', message);

//         res.status(200).json({ success: true, message: 'Message sent successfully' });
//     } catch (error) {
//         console.log('error at send messages', error);
//         res.status(500).json({ success: false, error: error });
//     }
// };


// export const sendMessageSales = async (req: Request, res: Response) => {
//     const senderId = req.id
//     try {
//         const { recipientId, text } = req.body;

//         const message = new Messages({
//             content: text,
//             sender: senderId,
//             receiver: recipientId,
//             senderModel: 'RetailerSales', // Adjust based on the sender's model
//             receiverModel: 'ProductionAdmin', // Adjust based on the receiver's model
//             timestamp: new Date(),
//         });

//         // Save the message to the database
//         await message.save();

//         // Emit the message to the recipient using Socket.io
//         // io.to(recipientId).emit('message', message);

//         res.status(200).json({ success: true, message: 'Message sent successfully' });
//     } catch (error) {
//         console.log('error at send messages', error);
//         res.status(500).json({ success: false, error: error });
//     }
// };

// export const getMessageProd = async (req: Request, res: Response) => {
//     const senderId = req.id
//     try {
//         const { recipientId } = req.body
//         const messagesProd = await Messages.find({
//             sender: senderId,
//             receiver: recipientId
//         })
//         const messagesSales = await Messages.find({
//             sender:recipientId,
//             receiver : senderId
//         })
//         const combinedMessages = [...messagesProd, ...messagesSales].sort((a, b) => a.timestamp - b.timestamp);
//         console.log('messages combined is', combinedMessages);

//         res.status(200).json({success:true, combinedMessages})

//     } catch (error) {
//         console.log('error at fetching messages', error);
//         res.status(500).json({ success: false, error: error });
//     }
// }

// export const getMessageSales = async (req: Request, res: Response) => {
//     const senderId = req.id
//     try {
//         const { recipientId } = req.body
//         const messagesSales = await Messages.find({
//             sender: senderId,
//             receiver: recipientId
//         })
//         const messagesProd = await Messages.find({
//             sender:recipientId,
//             receiver : senderId
//         })
//         const combinedMessages = [...messagesSales, ...messagesProd].sort((a, b) => a.timestamp - b.timestamp);
//         console.log('messages combined is', combinedMessages);
        
//         res.status(200).json({success:true, combinedMessages})

//     } catch (error) {
//         console.log('error at fetching messages', error);
//         res.status(500).json({ success: false, error: error });
//     }
// }