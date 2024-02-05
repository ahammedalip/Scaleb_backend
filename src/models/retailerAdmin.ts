import mongoose, { Document, Schema, model } from "mongoose";

interface UserInterface extends Document{
    retailerName: string,
    email : string,
    password: string,
    isBlocked: boolean,
    role: string,
}

const userSchema = new Schema<UserInterface>({
    retailerName: {
        type:String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required : true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        default: 'retailer'
    }
})

const retailerAdmin = model<UserInterface>('RetailerAdmin', userSchema);

export default retailerAdmin; 