import mongoose, { Document, Schema, model } from "mongoose";

interface Message extends Document{
    content : string;
    sender : mongoose.Schema.Types.ObjectId;
    receiver : mongoose.Schema.Types.ObjectId;
    senderModel: string;
    receiverModel: string;
    timestamp:Date;

}

const messageSchema  = new Schema <Message>({
    content: {
        type: String,
        required: true,
     },
     sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel' 
     },
     receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel' 
     },
     senderModel: {
        type: String,
        required: true,
        enum: ['ProductionAdmin', 'RetailerSales'] 
     },
     receiverModel: {
        type: String,
        required: true,
        enum: ['ProductionAdmin', 'RetailerSales'] 
     },
     timestamp: {
        type: Date,
        default: Date.now,
     },
})

export const Messages = model<Message>('Message', messageSchema)