import mongoose, { Document, Schema, model } from "mongoose";

interface Message extends Document {
   conversationId: string;
   sender: string;
   text: string;

}

const messageSchema = new Schema<Message>({
   conversationId: {
      type: String
   },
   sender: {
      type: String
   },
   text:{
      type: String
   }
},
{timestamps: true})

export const Messages = model<Message>('Message', messageSchema)