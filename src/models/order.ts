
import mongoose, { Document, Schema, model } from "mongoose";

interface Order extends Document {
    production:mongoose.Schema.Types.ObjectId;
    salesExec: mongoose.Schema.Types.ObjectId;
    retailerId:mongoose.Schema.Types.ObjectId;
    scheduledDate: Date;
    imageURL:string[];
    quantity:number;
    status: string;
    blocked:boolean;
    accepted:boolean;
    description: string;

}

const userSchema = new Schema<Order>({
    production: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductionAdmin'
    },
    salesExec:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RetailerSales'
    },
    retailerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RetailerAdmin'
    },
    scheduledDate:{
        type:Date
    },
    imageURL:[{
        type:String,

    }],
    quantity:{
        type:Number
    },
    status:{
        type:String
    },
    blocked:{
        type:Boolean,
        default: false
    },
    accepted:{
        type:Boolean,
    },
    description:{
        type:String,
    },


},{timestamps:true})

const order = model<Order>('Order',userSchema)

export default order;

